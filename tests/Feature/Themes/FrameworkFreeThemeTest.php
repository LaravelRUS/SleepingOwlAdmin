<?php

use Illuminate\Contracts\Routing\UrlGenerator;
use SleepingOwl\Admin\Assets\AssetManifestLoader;
use SleepingOwl\Admin\Assets\AssetManifestResolver;
use SleepingOwl\Admin\Assets\AssetRegistry;
use SleepingOwl\Admin\Assets\LogicalAssetRegistrar;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;
use SleepingOwl\Admin\Display\Display;
use SleepingOwl\Admin\Display\ExtensionCollection;
use SleepingOwl\Admin\Form\FormDefault;
use SleepingOwl\Admin\Themes\AdminLTETheme;
use SleepingOwl\Admin\Themes\ThemeCapabilities;
use SleepingOwl\Admin\Themes\ThemeResolver;
use SleepingOwl\Admin\Themes\ThemeRuntimeAssets;
use SleepingOwl\Admin\Themes\ThemeTemplateAdapter;
use SleepingOwl\Admin\Themes\ThemeSelection;
use SleepingOwl\Tests\Fixtures\Themes\FrameworkFreeTestTheme;

class FrameworkFreeThemeTest extends TestCase
{
    protected function resolveApplicationConfiguration($app)
    {
        parent::resolveApplicationConfiguration($app);

        $app['config']->set('sleeping_owl.template', [
            'default' => 'framework-free-test',
            'themes' => ['framework-free-test' => FrameworkFreeTestTheme::class],
        ]);
    }

    protected function setUp(): void
    {
        parent::setUp();

        view()->addNamespace(
            'framework-free-test',
            __DIR__.'/../../Fixtures/views/themes/framework-free'
        );
    }

    public function test_config_selects_a_framework_free_theme_through_only_the_public_contract(): void
    {
        $theme = app(ThemeInterface::class);
        $template = app('sleeping_owl.template');

        $this->assertInstanceOf(FrameworkFreeTestTheme::class, $theme);
        $this->assertInstanceOf(ThemeTemplateAdapter::class, $template);
        $this->assertSame('framework-free-test', app(ThemeSelection::class)->name());
        $this->assertSame('framework-free-test::contract', $theme->viewNamespace());
        $this->assertSame([], $theme->icons());
        $this->assertSame([
            'dropdown',
            'notification',
            'sidebar',
            'table-presentation',
            'tabs',
            'tooltip',
        ], $theme->capabilities());

        $capabilities = ThemeCapabilities::fromTheme($theme)->ids();
        $adminlteCapabilities = ThemeCapabilities::fromTheme(app(AdminLTETheme::class))->ids();

        $this->assertSame([], array_values(array_diff($capabilities, $adminlteCapabilities)));
        $this->assertSame(
            ['modal', 'icons'],
            array_values(array_diff($adminlteCapabilities, $capabilities))
        );
    }

    public function test_blade_owns_framework_free_display_and_form_markup(): void
    {
        $attributes = [
            'aria-label' => 'Project & review',
            'class' => 'project-surface',
            'data-project-state' => 'ready',
        ];
        $display = (new FrameworkFreeContractDisplay())
            ->setTitle('Shared <display>')
            ->setHtmlAttributes($attributes);
        $form = (new FrameworkFreeContractForm('Shared & form'))
            ->setHtmlAttributes($attributes);

        $displayHtml = $display->render()->render();
        $formHtml = $form->render()->render();

        $this->assertFrameworkFreeAttributes($displayHtml, 'workbench-display');
        $this->assertFrameworkFreeAttributes($formHtml, 'workbench-form');
        $this->assertStringContainsString('Shared &lt;display&gt;', $displayHtml);
        $this->assertStringContainsString('Shared &amp; form', $formHtml);
        $this->assertStringContainsString('class="workbench-button"', $formHtml);
    }

    public function test_public_theme_metadata_builds_the_complete_logical_runtime_order(): void
    {
        $runtime = app(ThemeRuntimeAssets::class);

        $this->assertSame([
            'core',
            'shared:compatibility',
            'shared:vue',
            'shared:ui',
            'shared:features',
            'theme:framework-free-test',
            'shared:modules',
        ], $runtime->logicalEntries('framework-free-test', app(ThemeInterface::class)));
    }

    public function test_each_profile_registers_only_the_selected_theme_bundle_and_adapters(): void
    {
        foreach (['production', 'development'] as $profile) {
            $customSources = $this->registeredSources(FrameworkFreeTestTheme::class, $profile);
            $adminlteSources = $this->registeredSources(AdminLTETheme::class, $profile);

            $this->assertSelectedThemeSources($customSources, $profile, 'framework-free-test');
            $this->assertSelectedThemeSources($adminlteSources, $profile, 'adminlte');
            $this->assertStringNotContainsString('icons.css', implode('|', $customSources));
            $this->assertCount(1, array_filter(
                $customSources,
                static fn (string $source): bool => str_contains($source, '/css/shared/ui.css')
            ));
        }
    }

    private function registeredSources(string $themeClass, string $profile): array
    {
        $this->useSourceAssetManifest($profile);
        $registry = app(AssetRegistry::class);
        $registry->clear();
        $selection = (new ThemeResolver($this->app))->resolve($themeClass);
        app(ThemeRuntimeAssets::class)->register($selection->name(), $selection->theme());

        return [
            ...array_map(static fn ($asset) => $asset->source(), $registry->registeredScripts()),
            ...array_map(static fn ($asset) => $asset->source(), $registry->registeredStyles()),
        ];
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

    private function assertSelectedThemeSources(array $sources, string $profile, string $theme): void
    {
        $themeSources = array_values(array_filter(
            $sources,
            static fn (string $source): bool => str_contains($source, '/themes/')
        ));

        $this->assertNotSame([], $themeSources);
        $this->assertContains("profiles/{$profile}/css/themes/{$theme}.css", array_map(
            static fn (string $source): string => strstr(
                parse_url($source, PHP_URL_PATH) ?: $source,
                "profiles/{$profile}/"
            ),
            $themeSources
        ));

        foreach ($themeSources as $source) {
            $this->assertStringContainsString($theme, $source);
        }
    }

    private function assertFrameworkFreeAttributes(string $html, string $themeClass): void
    {
        $this->assertStringContainsString("class=\"{$themeClass} project-surface\"", $html);
        $this->assertStringContainsString('aria-label="Project &amp; review"', $html);
        $this->assertStringContainsString('data-project-state="ready"', $html);
        $this->assertStringNotContainsString('data-soa-', $html);
    }
}

final class FrameworkFreeContractDisplay extends Display
{
    protected $view = 'display';

    public function __construct()
    {
        parent::__construct();

        $this->extensions = new ExtensionCollection();
    }

    public function toArray(): array
    {
        return parent::toArray() + ['contractInstanceId' => spl_object_id($this)];
    }
}

final class FrameworkFreeContractForm extends FormDefault
{
    public function __construct(private string $contractValue)
    {
        parent::__construct();

        $this->setView('form');
    }

    public function toArray(): array
    {
        return [
            'attributesArray' => $this->getHtmlAttributes(),
            'contractInstanceId' => spl_object_id($this),
            'value' => $this->contractValue,
        ];
    }
}
