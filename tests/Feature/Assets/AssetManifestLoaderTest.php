<?php

use Illuminate\Filesystem\Filesystem;
use SleepingOwl\Admin\Assets\AssetManifestLoader;
use SleepingOwl\Admin\Exceptions\AssetManifestException;

class AssetManifestLoaderTest extends TestCase
{
    public function test_it_loads_the_compiled_package_manifest(): void
    {
        $manifest = $this->loader()->load(
            dirname(__DIR__, 3).'/public/default/asset-manifest.json'
        );

        $this->assertSame(['production'], $manifest->profileIds());
        $this->assertSame([
            'core',
            'feature:forms',
            'feature:table',
            'theme:legacy-adminlte',
            'theme:tailwind',
        ], $manifest->profile('production')->entryIds());
    }

    public function test_missing_manifest_has_an_actionable_diagnostic(): void
    {
        $this->expectException(AssetManifestException::class);
        $this->expectExceptionMessage('file is missing');
        $this->expectExceptionMessage('php artisan sleepingowl:update');

        $this->loader()->load(__DIR__.'/missing-asset-manifest.json');
    }

    public function test_invalid_json_has_an_actionable_diagnostic(): void
    {
        $this->expectException(AssetManifestException::class);
        $this->expectExceptionMessage('php artisan sleepingowl:update');

        $this->loader()->load(
            dirname(__DIR__, 2).'/Fixtures/assets/invalid-asset-manifest.json'
        );
    }

    private function loader(): AssetManifestLoader
    {
        return new AssetManifestLoader(new Filesystem());
    }
}
