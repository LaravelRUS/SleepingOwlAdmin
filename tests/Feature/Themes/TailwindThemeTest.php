<?php

use Illuminate\Contracts\Routing\UrlGenerator;
use SleepingOwl\Admin\Assets\AssetManifestLoader;
use SleepingOwl\Admin\Assets\AssetManifestResolver;
use SleepingOwl\Admin\Assets\AssetRegistry;
use SleepingOwl\Admin\Assets\LogicalAssetRegistrar;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;
use SleepingOwl\Admin\Themes\TailwindTheme;
use SleepingOwl\Admin\Themes\ThemeAssetManifest;
use SleepingOwl\Admin\Themes\ThemeCapability;
use SleepingOwl\Admin\Themes\ThemeRuntimeAssets;
use SleepingOwl\Admin\Themes\ThemeSelection;
use SleepingOwl\Admin\Themes\ThemeTemplateAdapter;

class TailwindThemeTest extends TestCase
{
    protected function resolveApplicationConfiguration($app)
    {
        parent::resolveApplicationConfiguration($app);

        $app['config']->set('sleeping_owl.template.default', 'tailwind');
    }

    public function test_config_name_selects_the_direct_tailwind_theme(): void
    {
        $theme = app(ThemeInterface::class);
        $template = app('sleeping_owl.template');

        $this->assertSame(TailwindTheme::class, config('sleeping_owl.template.themes.tailwind'));
        $this->assertInstanceOf(TailwindTheme::class, $theme);
        $this->assertInstanceOf(ThemeTemplateAdapter::class, $template);
        $this->assertSame('tailwind', app(ThemeSelection::class)->name());
        $this->assertSame('sleeping_owl_tailwind::default', $theme->viewNamespace());
        $this->assertSame([], $theme->icons());
        $this->assertSame(
            array_map(
                fn (ThemeCapability $capability): string => $capability->value,
                ThemeCapability::cases()
            ),
            $theme->capabilities()
        );
    }

    public function test_it_declares_only_unscoped_shared_dependencies(): void
    {
        $theme = app(TailwindTheme::class);
        $manifest = ThemeAssetManifest::fromTheme('tailwind', $theme);

        $this->assertSame([
            'shared:compatibility',
            'shared:modules',
            'shared:vue',
            'theme:tailwind',
        ], $manifest->entries());
        $this->assertSame([
            'core',
            'shared:icons',
            'shared:compatibility',
            'shared:vue',
            'shared:ui',
            'shared:features',
            'theme:tailwind',
            'shared:modules',
        ], app(ThemeRuntimeAssets::class)->logicalEntries('tailwind', $theme));
    }

    public function test_profiles_register_css_only_tailwind_after_shared_presentation(): void
    {
        foreach (['production', 'development'] as $profile) {
            $this->useSourceAssetManifest($profile);
            $registry = app(AssetRegistry::class);
            $registry->clear();

            app('sleeping_owl.template')->initialize();

            $scripts = $this->profileSources($registry->registeredScripts(), $profile);
            $styles = $this->profileSources($registry->registeredStyles(), $profile);
            $joined = implode('|', [...$scripts, ...$styles]);

            $this->assertSame([
                "profiles/{$profile}/js/admin-core.js",
                "profiles/{$profile}/js/shared/compatibility.js",
                "profiles/{$profile}/js/shared/vue.js",
                "profiles/{$profile}/js/shared/features.js",
                "profiles/{$profile}/js/shared/modules.js",
            ], $scripts);
            $this->assertSame([
                "profiles/{$profile}/css/admin-core.css",
                "profiles/{$profile}/css/icons.css",
                "profiles/{$profile}/css/shared/ui.css",
                "profiles/{$profile}/css/shared/features.css",
                "profiles/{$profile}/css/themes/tailwind.css",
            ], $styles);
            $this->assertStringNotContainsString('adminlte', $joined);
            $this->assertStringNotContainsString('tabler', $joined);
            $this->assertStringNotContainsString('theme-overrides', $joined);
            $this->assertStringNotContainsString('/js/themes/tailwind', $joined);
        }
    }

    public function test_provider_registers_sparse_theme_then_base(): void
    {
        $paths = array_map('realpath', view()->getFinder()->getHints()['sleeping_owl_tailwind']);
        $theme = realpath(__DIR__.'/../../../resources/views/themes/tailwind');
        $base = realpath(__DIR__.'/../../../resources/views');

        $this->assertSame([$theme, $base], $paths);
        $this->assertSame(
            realpath(__DIR__.'/../../../resources/views/default/_layout/inner.blade.php'),
            realpath(view()->getFinder()->find('sleeping_owl_tailwind::default._layout.inner'))
        );
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

    private function profileSources(array $assets, string $profile): array
    {
        $marker = "profiles/{$profile}/";

        return array_map(
            static fn ($asset): string => strstr(
                parse_url($asset->source(), PHP_URL_PATH) ?: $asset->source(),
                $marker
            ),
            $assets
        );
    }
}
