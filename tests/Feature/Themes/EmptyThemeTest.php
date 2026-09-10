<?php

use Illuminate\Contracts\Routing\UrlGenerator;
use SleepingOwl\Admin\Assets\AssetManifestLoader;
use SleepingOwl\Admin\Assets\AssetManifestResolver;
use SleepingOwl\Admin\Assets\AssetRegistry;
use SleepingOwl\Admin\Assets\LogicalAssetRegistrar;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;
use SleepingOwl\Admin\Themes\EmptyTheme;
use SleepingOwl\Admin\Themes\ThemeRuntimeAssets;
use SleepingOwl\Admin\Themes\ThemeSelection;
use SleepingOwl\Admin\Themes\ThemeTemplateAdapter;

class EmptyThemeTest extends TestCase
{
    protected function resolveApplicationConfiguration($app)
    {
        parent::resolveApplicationConfiguration($app);

        $app['config']->set('sleeping_owl.template.default', 'empty');
    }

    public function test_it_selects_the_shared_foundation_diagnostic_theme(): void
    {
        $theme = app(ThemeInterface::class);
        $template = app('sleeping_owl.template');

        $this->assertInstanceOf(EmptyTheme::class, $theme);
        $this->assertInstanceOf(ThemeTemplateAdapter::class, $template);
        $this->assertSame('empty', app(ThemeSelection::class)->name());
        $this->assertSame('sleeping_owl::default', $theme->viewNamespace());
        $this->assertSame([], $theme->icons());
        $this->assertSame(['icons'], $theme->capabilities());
    }

    public function test_it_loads_every_core_and_shared_asset_without_theme_presentation(): void
    {
        $runtime = app(ThemeRuntimeAssets::class);
        $theme = app(ThemeInterface::class);

        $this->assertSame([
            'core',
            'shared:icons',
            'shared:compatibility',
            'shared:vue',
            'shared:ui',
            'shared:features',
            'theme:empty',
            'shared:modules',
        ], $runtime->logicalEntries('empty', $theme));

        $manifest = app(AssetManifestLoader::class)->load(
            dirname(__DIR__, 3).'/public/default/asset-manifest.json'
        );
        $expectedCoreAndShared = array_values(array_filter(
            $manifest->profile('production')->entryIds(),
            static fn (string $id): bool => $id === 'core' || str_starts_with($id, 'shared:')
        ));
        $actualCoreAndShared = array_values(array_filter(
            $runtime->logicalEntries('empty', $theme),
            static fn (string $id): bool => $id === 'core' || str_starts_with($id, 'shared:')
        ));
        sort($expectedCoreAndShared);
        sort($actualCoreAndShared);

        $this->assertSame($expectedCoreAndShared, $actualCoreAndShared);

        foreach (['production', 'development'] as $profile) {
            $this->useSourceAssetManifest($profile);
            $registry = app(AssetRegistry::class);
            $registry->clear();
            app('sleeping_owl.template')->initialize();

            $scriptSources = array_map(
                static fn ($asset): string => $asset->source(),
                $registry->registeredScripts()
            );
            $styleSources = array_map(
                static fn ($asset): string => $asset->source(),
                $registry->registeredStyles()
            );

            $this->assertSame([
                "profiles/{$profile}/js/admin-core.js",
                "profiles/{$profile}/js/shared/compatibility.js",
                "profiles/{$profile}/js/shared/vue.js",
                "profiles/{$profile}/js/shared/features.js",
                "profiles/{$profile}/js/shared/modules.js",
            ], $this->profileSources($scriptSources, $profile));
            $this->assertSame([
                "profiles/{$profile}/css/admin-core.css",
                "profiles/{$profile}/css/icons.css",
                "profiles/{$profile}/css/shared/ui.css",
                "profiles/{$profile}/css/shared/features.css",
                "profiles/{$profile}/css/themes/empty.css",
            ], $this->profileSources($styleSources, $profile));

            $joined = implode('|', [
                ...$scriptSources,
                ...$styleSources,
            ]);
            $this->assertStringNotContainsString('adminlte', $joined);
            $this->assertStringNotContainsString('theme-overrides', $joined);
        }
    }

    private function useSourceAssetManifest(string $profile): void
    {
        $manifest = app(AssetManifestLoader::class)->load(
            dirname(__DIR__, 3).'/public/default/asset-manifest.json'
        );
        app()->instance(AssetManifestResolver::class, new AssetManifestResolver(
            $manifest,
            app(UrlGenerator::class),
            'packages/sleepingowl/default',
            $profile
        ));
        app()->forgetInstance(LogicalAssetRegistrar::class);
        app()->forgetInstance(ThemeRuntimeAssets::class);
    }

    private function profileSources(array $sources, string $profile): array
    {
        $marker = "profiles/{$profile}/";

        return array_map(
            static fn (string $source): string => strstr(
                parse_url($source, PHP_URL_PATH) ?: $source,
                $marker
            ),
            $sources
        );
    }
}
