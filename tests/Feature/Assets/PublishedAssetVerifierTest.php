<?php

use Illuminate\Filesystem\Filesystem;
use SleepingOwl\Admin\Assets\ComposerPackageVersion;
use SleepingOwl\Admin\Assets\PublishedAssetVerifier;
use SleepingOwl\Admin\Exceptions\AssetManifestException;

class PublishedAssetVerifierTest extends TestCase
{
    private string $assetRoot;

    protected function setUp(): void
    {
        parent::setUp();

        $this->assetRoot = sys_get_temp_dir().'/sleepingowl-assets-'.bin2hex(random_bytes(8));
        $this->files()->copyDirectory(
            dirname(__DIR__, 3).'/public/default',
            $this->assetRoot
        );
    }

    protected function tearDown(): void
    {
        $this->files()->deleteDirectory($this->assetRoot);

        parent::tearDown();
    }

    public function test_it_verifies_the_complete_selected_profile(): void
    {
        $report = $this->verifier()->verify($this->assetRoot);

        $this->assertSame('production', $report->profile());
        $this->assertSame(40, $report->fileCount());
        $this->assertSame(
            $this->app->make(ComposerPackageVersion::class)->current(),
            $report->packageVersion()
        );

        config()->set('sleeping_owl.dev_assets', true);
        $this->assertSame('development', $this->verifier()->verify($this->assetRoot)->profile());
    }

    public function test_it_rejects_corrupt_published_files(): void
    {
        $this->files()->put(
            $this->assetRoot.'/profiles/production/js/admin-core.js',
            'corrupt'
        );

        $this->expectException(AssetManifestException::class);
        $this->expectExceptionMessage('invalid version hash');
        $this->verifier()->verify($this->assetRoot);
    }

    public function test_it_rejects_a_manifest_from_another_package_version(): void
    {
        $path = $this->assetRoot.'/asset-manifest.json';
        $manifest = json_decode($this->files()->get($path), true, 512, JSON_THROW_ON_ERROR);
        $manifest['package_version'] = '0.0.0-mismatch';
        $this->files()->put($path, json_encode($manifest, JSON_THROW_ON_ERROR));

        $this->expectException(AssetManifestException::class);
        $this->expectExceptionMessage('does not match installed version');
        $this->verifier()->verify($this->assetRoot);
    }

    public function test_it_accepts_a_manifest_from_another_development_branch(): void
    {
        $path = $this->assetRoot.'/asset-manifest.json';
        $manifest = json_decode($this->files()->get($path), true, 512, JSON_THROW_ON_ERROR);
        $manifest['package_version'] = 'dev-feature-branch';
        $this->files()->put($path, json_encode($manifest, JSON_THROW_ON_ERROR));

        $this->assertSame('production', $this->verifier()->verify($this->assetRoot)->profile());
    }

    private function verifier(): PublishedAssetVerifier
    {
        return $this->app->make(PublishedAssetVerifier::class);
    }

    private function files(): Filesystem
    {
        return $this->app->make('files');
    }
}
