<?php

use Illuminate\Contracts\Routing\UrlGenerator;
use SleepingOwl\Admin\Assets\AssetManifestLoader;
use SleepingOwl\Admin\Assets\AssetManifestResolver;
use SleepingOwl\Admin\Assets\AssetRegistry;
use SleepingOwl\Admin\Assets\LogicalAssetRegistrar;
use SleepingOwl\Admin\Contracts\Template\MetaInterface;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;
use SleepingOwl\Admin\Themes\AdminLTETheme;
use SleepingOwl\Admin\Themes\ThemeAssetManifest;
use SleepingOwl\Admin\Themes\ThemeCapability;
use SleepingOwl\Admin\Themes\ThemeSelection;

class AdminLTEThemeTest extends TestCase
{
    public function test_it_is_the_default_direct_theme_and_template(): void
    {
        $theme = $this->app->make(ThemeInterface::class);
        $template = $this->app->make('sleeping_owl.template');

        $this->assertSame('adminlte', config('sleeping_owl.template.default'));
        $this->assertSame(
            AdminLTETheme::class,
            config('sleeping_owl.template.themes.adminlte')
        );
        $this->assertInstanceOf(AdminLTETheme::class, $theme);
        $this->assertInstanceOf(TemplateInterface::class, $theme);
        $this->assertSame($theme, $template);
        $this->assertSame($theme, $this->app->make('sleeping_owl')->theme());
        $this->assertSame('adminlte', $this->app->make(ThemeSelection::class)->name());
        $this->assertSame('sleeping_owl::default', $theme->viewNamespace());
    }

    public function test_it_declares_shared_runtime_theme_and_component_adapters(): void
    {
        $manifest = ThemeAssetManifest::fromTheme(
            'adminlte',
            $this->app->make(AdminLTETheme::class)
        );

        $this->assertSame([
            'shared:compatibility',
            'shared:modules',
            'shared:vue',
            'theme:adminlte',
            'theme:adminlte:overrides',
        ], $manifest->entries());
        $this->assertSame([
            'shared:compatibility',
            'shared:modules',
            'shared:vue',
            'theme:adminlte',
            'theme:adminlte:overrides',
        ], $manifest->entriesFor(['tabs', 'table']));
    }

    public function test_it_exposes_existing_adminlte_capabilities_without_icon_remapping(): void
    {
        $theme = $this->app->make(AdminLTETheme::class);

        $this->assertSame([], $theme->icons());
        $this->assertSame(
            array_map(
                fn (ThemeCapability $capability): string => $capability->value,
                ThemeCapability::cases()
            ),
            $theme->capabilities()
        );
    }

    public function test_it_initializes_the_versioned_logical_runtime_with_legacy_handles(): void
    {
        foreach (['production' => false, 'development' => true] as $profile => $development) {
            config()->set('sleeping_owl.dev_assets', $development);
            $this->useSourceAssetManifest($profile);
            $registry = $this->app->make(AssetRegistry::class);
            $registry->clear();

            $this->app->make(AdminLTETheme::class)->initialize();

            $this->assertLogicalRuntime($registry, $profile);
        }
    }

    public function test_legacy_handles_keep_project_assets_before_the_final_module_boot(): void
    {
        $this->useSourceAssetManifest('production');
        $registry = $this->app->make(AssetRegistry::class);
        $registry->clear();
        $meta = $this->app->make(MetaInterface::class);
        $meta->addJs('project-vue', '/project/vue.js', 'admin-vue-init');
        $meta->addJs('project-runtime', '/project/runtime.js', 'admin-default');

        $this->app->make(AdminLTETheme::class)->initialize();

        $handles = array_map(fn ($asset) => $asset->handle(), $registry->scripts(true));
        $this->assertHandleOrder($handles, 'admin-vue-init', 'project-vue');
        $this->assertHandleOrder($handles, 'admin-default', 'project-runtime');
        $this->assertHandleOrder($handles, 'project-runtime', 'admin-modules-load');
    }

    private function useSourceAssetManifest(string $profile): void
    {
        $manifest = $this->app->make(AssetManifestLoader::class)->load(
            dirname(__DIR__, 3).'/public/default/asset-manifest.json'
        );
        $resolver = new AssetManifestResolver(
            $manifest,
            $this->app->make(UrlGenerator::class),
            'packages/sleepingowl/default',
            $profile
        );

        $this->app->instance(AssetManifestResolver::class, $resolver);
        $this->app->forgetInstance(LogicalAssetRegistrar::class);
    }

    private function assertLogicalRuntime(AssetRegistry $registry, string $profile): void
    {
        $scripts = $registry->registeredScripts();
        $styles = $registry->registeredStyles();
        $scriptSources = array_map(fn ($asset) => $asset->source(), $scripts);
        $styleSources = array_map(fn ($asset) => $asset->source(), $styles);

        $this->assertSame($this->expectedScripts($profile), $this->profileSources($scriptSources, $profile));
        $this->assertSame($this->expectedStyles($profile), $this->profileSources($styleSources, $profile));
        $this->assertLegacyHandles($scripts, $styles);
        $this->assertRuntimeProfile($scriptSources, "profiles/{$profile}");
        $this->assertRuntimeProfile($styleSources, "profiles/{$profile}");
        $this->assertStringNotContainsString('shadcn', implode('|', [...$scriptSources, ...$styleSources]));
        $this->assertStringNotContainsString('js/admin-app', implode('|', $scriptSources));
        $this->assertStringNotContainsString('/js/vue.js', implode('|', $scriptSources));
        $this->assertStringNotContainsString('/js/modules.js', implode('|', $scriptSources));
    }

    private function assertLegacyHandles(array $scripts, array $styles): void
    {
        $scriptHandles = array_map(fn ($asset) => $asset->handle(), $scripts);
        $styleHandles = array_map(fn ($asset) => $asset->handle(), $styles);

        $this->assertContains('admin-default', $scriptHandles);
        $this->assertContains('admin-default', $styleHandles);
        $this->assertContains('admin-vue-init', $scriptHandles);
        $this->assertSame('admin-modules-load', $scripts[array_key_last($scripts)]->handle());
    }

    private function assertRuntimeProfile(array $sources, string $profile): void
    {
        foreach ($sources as $source) {
            $this->assertStringContainsString($profile, $source);
        }
    }

    private function assertHandleOrder(array $handles, string $first, string $second): void
    {
        $firstIndex = array_search($first, $handles, true);
        $secondIndex = array_search($second, $handles, true);

        $this->assertIsInt($firstIndex);
        $this->assertIsInt($secondIndex);
        $this->assertLessThan($secondIndex, $firstIndex);
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

    private function expectedScripts(string $profile): array
    {
        $root = "profiles/{$profile}/js";

        return [
            "{$root}/admin-core.js",
            "{$root}/shared/compatibility.js",
            "{$root}/shared/vue.js",
            "{$root}/themes/adminlte.js",
            "{$root}/shared/features.js",
            "{$root}/shared/modules.js",
        ];
    }

    private function expectedStyles(string $profile): array
    {
        $root = "profiles/{$profile}/css";

        return [
            "{$root}/admin-core.css",
            "{$root}/icons.css",
            "{$root}/shared/ui.css",
            "{$root}/shared/features.css",
            "{$root}/themes/adminlte.css",
            "{$root}/theme-overrides/adminlte.css",
        ];
    }
}
