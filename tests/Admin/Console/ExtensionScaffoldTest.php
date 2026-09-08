<?php

namespace SleepingOwl\Tests\Admin\Console;

use Illuminate\Filesystem\Filesystem;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;
use RuntimeException;
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

        $this->assertCount(11, $paths);
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
