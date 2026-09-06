<?php

use Illuminate\Filesystem\Filesystem;
use SleepingOwl\Admin\Assets\PublishedAssetVerifier;
use SleepingOwl\Admin\Console\Commands\InstallCommand;
use SleepingOwl\Admin\Console\Commands\UpdateCommand;
use SleepingOwl\Admin\Console\Installation\PublishAssets;

class UpdateCommandTest extends TestCase
{
    private string $publishedRoot;

    protected function getEnvironmentSetUp($app)
    {
        parent::getEnvironmentSetUp($app);

        $this->publishedRoot = sys_get_temp_dir().'/sleepingowl-public-'.bin2hex(random_bytes(8));
        $app->usePublicPath($this->publishedRoot);
    }

    protected function tearDown(): void
    {
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
        $this->assertFileExists($license);
        $this->assertStringContainsString(basename($license), (new Filesystem())->get($asset));
        $this->assertSame(37, app(PublishedAssetVerifier::class)->verify($assetRoot)->fileCount());

        (new Filesystem())->put($asset, 'corrupt');
        $this->artisan('sleepingowl:update')->assertSuccessful();

        $this->assertNotSame('corrupt', (new Filesystem())->get($asset));
        $this->assertSame(37, app(PublishedAssetVerifier::class)->verify($assetRoot)->fileCount());
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
