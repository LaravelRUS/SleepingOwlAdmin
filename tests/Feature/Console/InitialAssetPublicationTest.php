<?php

use Illuminate\Filesystem\Filesystem;
use Orchestra\Testbench\TestCase as OrchestraTestCase;
use SleepingOwl\Admin\Assets\AssetManifest;
use SleepingOwl\Admin\Providers\SleepingOwlServiceProvider;

final class InitialAssetPublicationTest extends OrchestraTestCase
{
    private string $publishedRoot;

    protected function getPackageProviders($app): array
    {
        return [SleepingOwlServiceProvider::class];
    }

    protected function getEnvironmentSetUp($app): void
    {
        $this->publishedRoot = sys_get_temp_dir().'/sleepingowl-first-publish-'.bin2hex(random_bytes(8));
        $app->usePublicPath($this->publishedRoot);
    }

    protected function tearDown(): void
    {
        (new Filesystem())->deleteDirectory($this->publishedRoot);

        parent::tearDown();
    }

    public function test_update_can_publish_assets_before_a_manifest_exists(): void
    {
        $manifest = $this->publishedRoot.'/packages/sleepingowl/default/asset-manifest.json';

        $this->assertFileDoesNotExist($manifest);
        $this->assertFalse($this->app->resolved(AssetManifest::class));

        $this->artisan('sleepingowl:update', ['--check' => true])->assertFailed();
        $this->assertFileDoesNotExist($manifest);

        $this->artisan('sleepingowl:update')->assertSuccessful();

        $this->assertFileExists($manifest);
    }
}
