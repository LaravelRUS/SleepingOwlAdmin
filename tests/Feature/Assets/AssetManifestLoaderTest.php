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

        $this->assertSame(['production', 'development'], $manifest->profileIds());
        $this->assertSame([
            'core',
            'shared:compatibility',
            'shared:features',
            'shared:icons',
            'shared:modules',
            'shared:ui',
            'shared:vue',
            'theme:adminlte',
            'theme:adminlte:overrides',
            'theme:empty',
            'theme:framework-free-test',
            'theme:shadcn',
            'theme:shadcn:overrides',
        ], $manifest->profile('production')->entryIds());
        $this->assertSame(
            $manifest->profile('production')->entryIds(),
            $manifest->profile('development')->entryIds()
        );
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

    public function test_it_loads_an_external_fragment_without_core(): void
    {
        $manifest = $this->loader()->loadFragment(
            dirname(__DIR__, 2).'/Fixtures/assets/external-theme-manifest.json'
        );

        $this->assertSame(
            ['theme:provider-test', 'feature:tooltip:theme:provider-test'],
            $manifest->profile('production')->entryIds()
        );
    }

    public function test_missing_external_fragment_has_theme_owned_recovery_guidance(): void
    {
        try {
            $this->loader()->loadFragment(__DIR__.'/missing-external-fragment.json');
            $this->fail('Missing external fragment was accepted.');
        } catch (AssetManifestException $exception) {
            $this->assertStringContainsString('manifest fragment', $exception->getMessage());
            $this->assertStringContainsString('external theme assets', $exception->getMessage());
            $this->assertStringNotContainsString('sleepingowl:update', $exception->getMessage());
        }
    }

    private function loader(): AssetManifestLoader
    {
        return new AssetManifestLoader(new Filesystem());
    }
}
