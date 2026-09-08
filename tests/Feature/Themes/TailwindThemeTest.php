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
use SleepingOwl\Admin\Themes\ThemeTemplateAdapter;

class TailwindThemeTest extends TestCase
{
    protected function resolveApplicationConfiguration($app)
    {
        parent::resolveApplicationConfiguration($app);

        $app['config']->set('sleeping_owl.template', TailwindTheme::class);
    }

    public function test_existing_config_key_selects_the_direct_tailwind_theme(): void
    {
        $theme = app(ThemeInterface::class);
        $template = app('sleeping_owl.template');

        $this->assertSame(TailwindTheme::class, config('sleeping_owl.template'));
        $this->assertInstanceOf(TailwindTheme::class, $theme);
        $this->assertInstanceOf(ThemeTemplateAdapter::class, $template);
        $this->assertSame('tailwind', $theme->id());
        $this->assertSame('sleeping_owl_tailwind::default', $template->getViewNamespace());
        $this->assertSame([
            'tooltip',
            'dropdown',
            'notification',
            'icons',
            'sidebar',
        ], $theme->capabilities());
        $this->assertSame([], $theme->icons());
    }

    public function test_it_declares_only_implemented_shell_adapters(): void
    {
        $manifest = ThemeAssetManifest::fromTheme(app(TailwindTheme::class));

        $this->assertSame([
            'shared:icons',
            'shared:compatibility',
            'shared:modules',
            'shared:vue',
            'theme:tailwind',
            'feature:dropdown:theme:tailwind',
            'feature:sidebar:theme:tailwind',
            'feature:tooltip:theme:tailwind',
        ], $manifest->entries());
        $this->assertSame([
            'core',
            'shared:icons',
            'shared:compatibility',
            'shared:vue',
            'theme:tailwind',
            'feature:alert',
            'feature:tooltip',
            'feature:tooltip:theme:tailwind',
            'feature:dropdown',
            'feature:dropdown:theme:tailwind',
            'feature:sidebar',
            'feature:sidebar:theme:tailwind',
            'feature:lightbox',
            'feature:table',
            'feature:tabs',
            'feature:forms',
            'feature:tree',
            'shared:modules',
        ], app(ThemeRuntimeAssets::class)->logicalEntries(app(TailwindTheme::class)));
    }

    public function test_each_profile_registers_only_implemented_tailwind_adapters(): void
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

            $this->assertStringContainsString("profiles/{$profile}/js/themes/tailwind.js", $joined);
            $this->assertStringContainsString("profiles/{$profile}/css/themes/tailwind.css", $joined);
            $this->assertStringContainsString("profiles/{$profile}/css/icons.css", $joined);
            $this->assertStringNotContainsString('legacy-adminlte', $joined);
            $this->assertStringContainsString('features/dropdown/themes/tailwind.css', $joined);
            $this->assertStringContainsString('features/sidebar/themes/tailwind.css', $joined);
            $this->assertStringContainsString('features/tooltip/themes/tailwind.css', $joined);
            $this->assertStringNotContainsString('feature:table:theme:tailwind', $joined);
        }
    }

    public function test_provider_registers_the_separate_blade_namespace(): void
    {
        $hints = view()->getFinder()->getHints();
        $paths = array_map(static fn (string $path): string => realpath($path), $hints['sleeping_owl_tailwind']);

        $this->assertArrayHasKey('sleeping_owl_tailwind', $hints);
        $this->assertContains(
            realpath(__DIR__.'/../../../resources/views/themes').DIRECTORY_SEPARATOR.'tailwind',
            $paths
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
