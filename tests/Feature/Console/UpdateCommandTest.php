<?php

use Illuminate\Filesystem\Filesystem;
use SleepingOwl\Admin\Assets\PublishedAssetVerifier;
use SleepingOwl\Admin\Console\Commands\InstallCommand;
use SleepingOwl\Admin\Console\Commands\UpdateCommand;
use SleepingOwl\Admin\Console\Installation\PublishAssets;

class UpdateCommandTest extends TestCase
{
    private string $configRoot;

    private string $publishedRoot;

    protected function getEnvironmentSetUp($app)
    {
        parent::getEnvironmentSetUp($app);

        $this->configRoot = sys_get_temp_dir().'/sleepingowl-config-'.bin2hex(random_bytes(8));
        $this->publishedRoot = sys_get_temp_dir().'/sleepingowl-public-'.bin2hex(random_bytes(8));
        (new Filesystem())->makeDirectory($this->configRoot, 0755, true);
        $app->useConfigPath($this->configRoot);
        $app->usePublicPath($this->publishedRoot);
    }

    protected function tearDown(): void
    {
        (new Filesystem())->deleteDirectory($this->configRoot);
        (new Filesystem())->deleteDirectory($this->publishedRoot);

        parent::tearDown();
    }

    public function test_update_force_publishes_and_verifies_precompiled_assets(): void
    {
        $this->artisan('sleepingowl:update')->assertSuccessful();

        $assetRoot = $this->publishedRoot.'/packages/sleepingowl/default';
        $asset = $assetRoot.'/profiles/production/js/admin-core.js';
        $license = $asset.'.LICENSE.txt';
        $this->assertFileExists($assetRoot.'/asset-manifest.json');
        $this->assertFileExists($assetRoot.'/fonts/OpenSans-Regular.ttf');
        $this->assertDirectoryDoesNotExist($assetRoot.'/profiles/production/fonts');
        $this->assertDirectoryDoesNotExist($assetRoot.'/profiles/production/css/fonts');
        $this->assertFileExists($license);
        $this->assertStringContainsString(basename($license), (new Filesystem())->get($asset));
        $this->assertSame(18, app(PublishedAssetVerifier::class)->verify($assetRoot)->fileCount());
        $this->assertSame(
            ['production', 'development'],
            array_map(
                static fn ($report): string => $report->profile(),
                app(PublishedAssetVerifier::class)->verifyAll($assetRoot)
            )
        );

        (new Filesystem())->put($asset, 'corrupt');
        $this->artisan('sleepingowl:update')->assertSuccessful();

        $this->assertNotSame('corrupt', (new Filesystem())->get($asset));
        $this->assertSame(18, app(PublishedAssetVerifier::class)->verify($assetRoot)->fileCount());
    }

    public function test_check_is_read_only_and_validates_both_profiles(): void
    {
        $this->artisan('sleepingowl:update')->assertSuccessful();

        $asset = $this->publishedRoot.'/packages/sleepingowl/default/profiles/development/js/admin-core.js';
        (new Filesystem())->put($asset, 'corrupt');

        $this->artisan('sleepingowl:update', ['--check' => true])->assertFailed();
        $this->assertSame('corrupt', (new Filesystem())->get($asset));

        $this->artisan('sleepingowl:update')->assertSuccessful();
        $this->artisan('sleepingowl:update', ['--check' => true])->assertSuccessful();
    }

    public function test_update_does_not_overwrite_the_published_application_config(): void
    {
        $config = $this->configRoot.'/sleeping_owl.php';
        $contents = "<?php\n\nreturn ['title' => 'Project config'];\n";
        (new Filesystem())->put($config, $contents);

        $this->artisan('sleepingowl:update')->assertSuccessful();

        $this->assertSame($contents, (new Filesystem())->get($config));
    }

    public function test_install_and_update_paths_do_not_invoke_a_frontend_toolchain(): void
    {
        foreach ([InstallCommand::class, UpdateCommand::class, PublishAssets::class] as $class) {
            $path = (new ReflectionClass($class))->getFileName();
            $source = file_get_contents($path);

            $this->assertDoesNotMatchRegularExpression(
                '/\b(?:npm|node|vite|webpack|mix)\b/i',
                $source
            );
        }
    }
}
