<?php

namespace SleepingOwl\Tests\Admin\Console;

use Illuminate\Filesystem\Filesystem;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;
use RuntimeException;
use SleepingOwl\Admin\Assets\AssetManifest;
use SleepingOwl\Admin\Console\Scaffolding\ExtensionScaffold;

final class ExtensionScaffoldTest extends TestCase
{
    private Filesystem $files;

    private ExtensionScaffold $scaffold;

    private string $root;

    protected function setUp(): void
    {
        parent::setUp();

        $this->files = new Filesystem();
        $this->scaffold = new ExtensionScaffold($this->files);
        $this->root = sys_get_temp_dir().DIRECTORY_SEPARATOR.'soa-extension-'.bin2hex(random_bytes(8));
        $this->files->makeDirectory($this->root, 0755, true);
    }

    protected function tearDown(): void
    {
        $this->files->deleteDirectory($this->root);

        parent::tearDown();
    }

    public function testEveryPublicExtensionTypeGeneratesMaintainedFiles(): void
    {
        $paths = [];

        foreach ($this->scaffold->supportedTypes() as $type) {
            array_push($paths, ...$this->generate($type, 'Order Status'));
        }

        $this->assertCount(19, $paths);
        foreach ($paths as $path) {
            $this->assertFileExists($path);
            $this->assertStringNotContainsString('Dummy', $this->files->get($path));
            $this->assertStringNotContainsString('dummy-kebab', $this->files->get($path));
        }

        $phpFiles = array_filter(
            $paths,
            static fn (string $path): bool => str_ends_with($path, '.php')
                && ! str_ends_with($path, '.blade.php')
        );

        foreach ($phpFiles as $path) {
            require_once $path;
        }

        $this->assertTrue(class_exists('App\\Admin\\Form\\Elements\\OrderStatus'));
        $this->assertTrue(class_exists('App\\Admin\\Widgets\\OrderStatus'));
        $this->assertTrue(class_exists('App\\Policies\\OrderStatus'));
        $this->assertTrue(class_exists('App\\Providers\\OrderStatus'));
        $this->assertTrue(class_exists('App\\Providers\\OrderStatusVueIslandServiceProvider'));
        $this->assertTrue(class_exists('App\\Admin\\Themes\\OrderStatus'));
        $this->assertTrue(class_exists('App\\Providers\\OrderStatusThemeServiceProvider'));
    }

    public function testVueIslandUsesThePublicRuntimeWithoutRemovedGlobals(): void
    {
        $paths = $this->generate('vue-island', 'Order Status');
        $javascript = $this->files->get($paths[0]);

        $this->assertStringContainsString("globalThis.Admin.Vue.register('order-status'", $javascript);
        $this->assertStringContainsString('globalThis.Admin.Vue.runtime', $javascript);
        $this->assertStringNotContainsString('window.Vue', $javascript);
        $this->assertStringNotContainsString('jQuery', $javascript);
        $this->assertStringNotContainsString('$(', $javascript);
        $this->assertStringContainsString(
            "'admin-vue-init'",
            $this->files->get($paths[2])
        );
    }

    public function testThemeIsASelfContainedNoBuildPackageUnit(): void
    {
        $paths = $this->generate('theme', 'Order Status');
        $normalized = array_map(static fn (string $path): string => str_replace('\\', '/', $path), $paths);

        $this->assertCount(10, $paths);
        $this->assertNotSame([], preg_grep('#/resources/css/themes/order-status/theme\.scss$#', $normalized));
        $this->assertNotSame([], preg_grep('#/resources/js/themes/order-status/theme\.js$#', $normalized));
        $this->assertNotSame([], preg_grep('#/resources/views/themes/order-status/#', $normalized));

        $manifestPath = current(preg_grep('#/asset-manifest\.json$#', $normalized));
        $this->assertIsString($manifestPath);
        $data = json_decode($this->files->get($manifestPath), true, 512, JSON_THROW_ON_ERROR);
        $manifest = AssetManifest::fromFragment($data);

        $this->assertSame(['production', 'development'], $manifest->profileIds());
        foreach ($manifest->profileIds() as $profile) {
            $bundle = $manifest->profile($profile)->bundle('theme:order-status');
            foreach ([...$bundle->scripts(), ...$bundle->styles()] as $asset) {
                $path = dirname($manifestPath).DIRECTORY_SEPARATOR.'public'.DIRECTORY_SEPARATOR
                    .str_replace('/', DIRECTORY_SEPARATOR, $asset->file());

                $this->assertFileExists($path);
                $this->assertSame(hash_file('md5', $path), $asset->version());
                $this->assertSame('sha256:'.hash_file('sha256', $path), $asset->checksum());
            }
        }

        $providerPath = current(preg_grep('#OrderStatusThemeServiceProvider\.php$#', $normalized));
        $provider = $this->files->get($providerPath);
        $this->assertStringContainsString("registerPackage(\n                'order-status'", $provider);
        $this->assertStringContainsString("'order-status-theme-assets'", $provider);
        $this->assertStringNotContainsString('node_modules', implode("\n", array_map(
            fn (string $path): string => $this->files->get($path),
            $paths
        )));
    }

    public function testExistingFilesRequireAnExplicitForceOption(): void
    {
        $this->generate('policy', 'Order Policy');

        $this->expectException(RuntimeException::class);
        $this->generate('policy', 'Order Policy');
    }

    public function testUnknownTypeFailsBeforeWritingFiles(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->generate('unknown', 'Order Extension');
    }

    /**
     * @return list<string>
     */
    private function generate(string $type, string $name): array
    {
        return $this->scaffold->generate(
            $type,
            $name,
            'App',
            $this->root.DIRECTORY_SEPARATOR.'app',
            $this->root.DIRECTORY_SEPARATOR.'resources'
        );
    }
}
