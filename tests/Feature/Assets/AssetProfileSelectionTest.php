<?php

use Illuminate\Filesystem\Filesystem;
use SleepingOwl\Admin\Assets\AssetManifestResolver;
use SleepingOwl\Admin\Assets\LogicalAssetRegistrar;

class AssetProfileSelectionTest extends TestCase
{
    private string $publishedRoot;

    protected function setUp(): void
    {
        parent::setUp();

        $this->publishedRoot = sys_get_temp_dir().'/sleepingowl-profile-'.bin2hex(random_bytes(8));
        $manifestDirectory = $this->publishedRoot.'/packages/sleepingowl/default';
        $files = new Filesystem();
        $files->ensureDirectoryExists($manifestDirectory);
        $files->copy(
            dirname(__DIR__, 3).'/public/default/asset-manifest.json',
            $manifestDirectory.'/asset-manifest.json'
        );
        $this->app->usePublicPath($this->publishedRoot);
    }

    protected function tearDown(): void
    {
        (new Filesystem())->deleteDirectory($this->publishedRoot);

        parent::tearDown();
    }

    public function test_false_selects_only_the_production_profile(): void
    {
        $url = $this->resolvedCoreScript(false);

        $this->assertStringContainsString('/profiles/production/', $url);
        $this->assertStringNotContainsString('/profiles/development/', $url);
    }

    public function test_true_selects_only_the_development_profile(): void
    {
        $url = $this->resolvedCoreScript(true);

        $this->assertStringContainsString('/profiles/development/', $url);
        $this->assertStringNotContainsString('/profiles/production/', $url);
    }

    private function resolvedCoreScript(bool $development): string
    {
        config()->set('sleeping_owl.dev_assets', $development);
        $this->app->forgetInstance(AssetManifestResolver::class);
        $this->app->forgetInstance(LogicalAssetRegistrar::class);

        return $this->app
            ->make(AssetManifestResolver::class)
            ->resolve('core')
            ->scripts()[0];
    }
}
