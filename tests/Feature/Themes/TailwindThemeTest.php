<?php

use Illuminate\Contracts\Routing\UrlGenerator;
use SleepingOwl\Admin\Assets\AssetManifestLoader;
use SleepingOwl\Admin\Assets\AssetManifestResolver;
use SleepingOwl\Admin\Assets\AssetRegistry;
use SleepingOwl\Admin\Assets\LogicalAssetRegistrar;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;
use SleepingOwl\Admin\Exceptions\TemplateException;
use SleepingOwl\Admin\Themes\TailwindTheme;
use SleepingOwl\Admin\Themes\ThemeAssetManifest;
use SleepingOwl\Admin\Themes\ThemeResolver;
use SleepingOwl\Admin\Themes\ThemeRuntimeAssets;
use SleepingOwl\Admin\Themes\ThemeSelection;
use SleepingOwl\Admin\Themes\ThemeTemplateAdapter;

class TailwindThemeTest extends TestCase
{
    protected function resolveApplicationConfiguration($app)
    {
        parent::resolveApplicationConfiguration($app);

        $app['config']->set('sleeping_owl.template', [
            'default' => 'shadcn',
            'themes' => [
                'adminlte' => SleepingOwl\Admin\Themes\AdminLTETheme::class,
                'shadcn' => TailwindTheme::class,
            ],
        ]);
    }

    public function test_existing_config_key_selects_the_direct_tailwind_theme(): void
    {
        $theme = app(ThemeInterface::class);
        $template = app('sleeping_owl.template');

        $this->assertSame('shadcn', config('sleeping_owl.template.default'));
        $this->assertSame(TailwindTheme::class, config('sleeping_owl.template.themes.shadcn'));
        $this->assertInstanceOf(TailwindTheme::class, $theme);
        $this->assertInstanceOf(ThemeTemplateAdapter::class, $template);
        $this->assertSame('shadcn', app(ThemeSelection::class)->name());
        $this->assertSame('sleeping_owl_shadcn::default', $template->getViewNamespace());
        $this->assertSame([
            'tooltip',
            'dropdown',
            'notification',
            'icons',
            'sidebar',
            'table-presentation',
            'tabs',
        ], $theme->capabilities());
        $this->assertSame([], $theme->icons());
    }

    public function test_it_declares_only_implemented_feature_adapters(): void
    {
        $manifest = ThemeAssetManifest::fromTheme('shadcn', app(TailwindTheme::class));

        $this->assertSame([
            'shared:icons',
            'shared:compatibility',
            'shared:modules',
            'shared:vue',
            'theme:shadcn',
            'theme:shadcn:overrides',
        ], $manifest->entries());
        $this->assertSame([
            'core',
            'shared:icons',
            'shared:compatibility',
            'shared:vue',
            'shared:ui',
            'shared:features',
            'theme:shadcn',
            'theme:shadcn:overrides',
            'shared:modules',
        ], app(ThemeRuntimeAssets::class)->logicalEntries('shadcn', app(TailwindTheme::class)));

        $this->assertSame([
            'core',
            'shared:icons',
            'shared:compatibility',
            'shared:vue',
            'shared:ui',
            'shared:features',
            'theme:shadcn',
            'theme:shadcn:overrides',
            'shared:modules',
        ], app(ThemeRuntimeAssets::class)->styleEntries('shadcn', app(TailwindTheme::class)));

        $this->assertSame([
            'core',
            'shared:icons',
            'shared:compatibility',
            'shared:vue',
            'theme:shadcn',
            'shared:features',
            'theme:shadcn:overrides',
            'shared:modules',
        ], app(ThemeRuntimeAssets::class)->scriptEntries('shadcn', app(TailwindTheme::class)));
    }

    public function test_each_profile_registers_implemented_tailwind_adapters(): void
    {
        foreach (['production', 'development'] as $profile) {
            $this->useSourceAssetManifest($profile);
            $registry = app(AssetRegistry::class);
            $registry->clear();

            app('sleeping_owl.template')->initialize();

            $sources = [
                ...array_map(static fn ($asset) => $asset->source(), $registry->registeredScripts()),
                ...array_map(static fn ($asset) => $asset->source(), $registry->registeredStyles()),
            ];
            $joined = implode('|', $sources);

            $this->assertStringContainsString("profiles/{$profile}/js/themes/shadcn.js", $joined);
            $this->assertStringContainsString("profiles/{$profile}/css/themes/shadcn.css", $joined);
            $this->assertStringContainsString("profiles/{$profile}/css/themes/shadcn-utilities.css", $joined);
            $this->assertStringContainsString("profiles/{$profile}/css/icons.css", $joined);
            $this->assertCount(1, array_filter(
                $sources,
                static fn (string $source): bool => str_contains($source, '/css/shared/ui.css')
            ));
            $this->assertStringContainsString(
                "profiles/{$profile}/css/theme-overrides/shadcn.css",
                $joined
            );
            $this->assertStringNotContainsString('adminlte', $joined);
            $this->assertStringContainsString("profiles/{$profile}/js/shared/features.js", $joined);
            $this->assertStringContainsString("profiles/{$profile}/css/shared/features.css", $joined);
        }
    }

    public function test_provider_registers_theme_then_base_for_the_separate_blade_namespace(): void
    {
        $hints = view()->getFinder()->getHints();
        $paths = array_map(static fn (string $path): string => realpath($path), $hints['sleeping_owl_shadcn']);
        $theme = realpath(__DIR__.'/../../../resources/views/themes/shadcn');
        $base = realpath(__DIR__.'/../../../resources/views');

        $this->assertArrayHasKey('sleeping_owl_shadcn', $hints);
        $this->assertContains($theme, $paths);
        $this->assertContains($base, $paths);
        $this->assertLessThan(
            array_search($base, $paths, true),
            array_search($theme, $paths, true)
        );
    }

    public function test_invalid_config_never_falls_back_to_adminlte(): void
    {
        $this->expectException(TemplateException::class);
        $this->expectExceptionMessage('Template class [MissingTailwindTheme] not found in config file');

        (new ThemeResolver($this->app))->resolve('MissingTailwindTheme');
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
}
