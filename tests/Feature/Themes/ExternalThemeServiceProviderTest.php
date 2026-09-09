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
use SleepingOwl\Admin\Themes\ThemeSelection;

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

        $this->assertSame('provider-test', config('sleeping_owl.template.default'));
        $this->assertInstanceOf(ProviderContractTheme::class, $theme);
        $this->assertSame('provider-test', app(ThemeSelection::class)->name());
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
        $this->assertCount(1, array_filter(
            $sources,
            static fn (string $source): bool => str_contains($source, '/css/shared/ui.css')
        ));
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

    public function test_duplicate_external_theme_name_is_rejected_explicitly(): void
    {
        $themes = app(ThemeRegistry::class);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Theme name [provider-test] is already registered.');

        $themes->registerPackage(
            'provider-test',
            ProviderContractTheme::class,
            __DIR__.'/../../Fixtures/themes/provider-test',
            'vendor/provider-test/duplicate'
        );
    }
}

final class ExternalThemeContractServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app['config']->set('sleeping_owl.ui.footer_text', 'Provider footer');
        $this->app['config']->set('sleeping_owl.ui.sidebar_background_color', '#102030');
        $this->app['config']->set('sleeping_owl.template.default', 'provider-test');

        $this->app->afterResolving(ThemeRegistry::class, function (ThemeRegistry $themes): void {
            $root = __DIR__.'/../../Fixtures/themes/provider-test';
            $themes->registerPackage(
                'provider-test',
                ProviderContractTheme::class,
                $root,
                'vendor/provider-test/final'
            );
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
    public function viewNamespace(): string
    {
        return 'provider-test::default';
    }

    public function assets(): array
    {
        return [
            'feature:tooltip',
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
