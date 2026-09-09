<?php

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\Assets\AssetRegistry;
use SleepingOwl\Admin\Contracts\Template\MetaInterface;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;
use SleepingOwl\Admin\Themes\AdminLTETheme;
use SleepingOwl\Admin\Themes\ThemeConfiguration;
use SleepingOwl\Admin\Themes\ThemeRegistry;
use SleepingOwl\Admin\Themes\ThemeTemplateAdapter;

class ExternalThemeServiceProviderTest extends TestCase
{
    protected function getPackageProviders($app)
    {
        return [
            ...parent::getPackageProviders($app),
            ExternalThemeContractServiceProvider::class,
        ];
    }

    public function test_provider_can_replace_the_configured_theme_and_its_ready_assets(): void
    {
        $theme = app(ThemeInterface::class);
        $this->app['sleeping_owl']->initialize();
        $registry = app(AssetRegistry::class);
        $sources = array_map(
            static fn ($asset): string => $asset->source(),
            $registry->registeredStyles()
        );

        $this->assertSame('adminlte', config('sleeping_owl.template.default'));
        $this->assertSame(
            AdminLTETheme::class,
            config('sleeping_owl.template.themes.adminlte')
        );
        $this->assertInstanceOf(ProviderContractTheme::class, $theme);
        $this->assertInstanceOf(ThemeTemplateAdapter::class, app('sleeping_owl.template'));
        $this->assertSame(app('sleeping_owl.template'), app('sleeping_owl')->template());
        $this->assertContains(
            'http://localhost/vendor/provider-test/final/profiles/production/css/provider-test.css?id='.
                '11111111111111111111111111111111',
            $sources
        );
        $this->assertContains(
            'http://localhost/vendor/provider-test/final/profiles/production/css/tooltip.css?id='.
                '22222222222222222222222222222222',
            $sources
        );
        $this->assertStringNotContainsString('adminlte', implode('|', $sources));
    }

    public function test_provider_settings_runtime_property_and_extra_assets_need_no_build(): void
    {
        $configuration = app(ThemeConfiguration::class);
        $registry = app(AssetRegistry::class);
        $styles = $registry->registeredStyles();
        $scripts = $registry->registeredScripts();
        $runtimeProperties = view('sleeping_owl::shared.theme.runtime_properties')->render();

        $this->assertSame('Provider footer', $configuration->get('footer_text'));
        $this->assertSame('#102030', $configuration->get('sidebar_background_color'));
        $this->assertStringContainsString('--soa-sidebar-bg: #102030;', $runtimeProperties);
        $this->assertSame('/project/admin.css', end($styles)->source());
        $this->assertSame('/project/admin.js', end($scripts)->source());
    }

    public function test_external_theme_receives_no_default_view_fallback_implicitly(): void
    {
        $this->assertArrayNotHasKey(
            'provider-test',
            view()->getFinder()->getHints()
        );
    }
}

final class ExternalThemeContractServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app['config']->set('sleeping_owl.ui.footer_text', 'Provider footer');
        $this->app['config']->set('sleeping_owl.ui.sidebar_background_color', '#102030');

        $this->app->afterResolving(ThemeRegistry::class, function (ThemeRegistry $themes): void {
            $manifest = __DIR__.'/../../Fixtures/assets/external-theme-manifest.json';
            $themes->register(ProviderContractTheme::class, $manifest, 'vendor/provider-test/first');
            $themes->register(ProviderContractTheme::class, $manifest, 'vendor/provider-test/final');
            $themes->replace(AdminLTETheme::class, ProviderContractTheme::class);
        });

        $this->app->booted(function (Application $app): void {
            $meta = $app->make(MetaInterface::class);
            $meta->addCss('project-admin', '/project/admin.css');
            $meta->addJs('project-admin', '/project/admin.js');
        });
    }
}

final class ProviderContractTheme implements ThemeInterface
{
    public function id(): string
    {
        return 'provider-test';
    }

    public function viewNamespace(): string
    {
        return 'provider-test::default';
    }

    public function assets(): array
    {
        return [
            'theme:provider-test',
            'feature:tooltip:theme:provider-test',
        ];
    }

    public function icons(): array
    {
        return [];
    }

    public function capabilities(): array
    {
        return ['tooltip'];
    }
}
