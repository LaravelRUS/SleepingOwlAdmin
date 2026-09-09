<?php

use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;
use SleepingOwl\Admin\Exceptions\TemplateException;
use SleepingOwl\Admin\Themes\ThemeConfiguration;
use SleepingOwl\Admin\Themes\ThemeResolver;
use SleepingOwl\Admin\Themes\ThemeTemplateAdapter;

class ThemeSelectionTest extends TestCase
{
    private const THEME_CONFIG = [
        'title' => 'Custom admin',
        'logo' => '<svg data-logo="custom"></svg>',
        'logo_mini' => 'CU',
        'menu_top' => 'Custom menu',
        'favicon' => '/custom/favicon.svg',
        'body_default_class' => 'custom-layout compact',
        'sidebar_background_color' => '#102030',
        'breadcrumbs' => false,
        'show_mode' => false,
        'scroll_to_top' => true,
        'scroll_to_bottom' => true,
        'show_footer' => true,
        'footer_text' => 'Custom footer',
        'show_version' => true,
        'version_text' => '2026.9',
        'useWysiwygCard' => true,
        'useRelationCard' => false,
        'useHasManyLocalCard' => true,
    ];

    protected function resolveApplicationConfiguration($app)
    {
        parent::resolveApplicationConfiguration($app);

        $app['config']->set('sleeping_owl.template', [
            'default' => 'selector-theme',
            'themes' => [
                'selector-theme' => SelectableContractTheme::class,
                'unused-theme' => UnselectedContractTheme::class,
            ],
        ]);

        foreach (self::THEME_CONFIG as $key => $value) {
            $app['config']->set("sleeping_owl.ui.{$key}", $value);
        }
    }

    protected function setUp(): void
    {
        parent::setUp();

        view()->addNamespace(
            'selector-theme',
            __DIR__.'/../../Fixtures/views/themes/selector'
        );
    }

    public function test_existing_template_key_selects_a_direct_theme_implementation(): void
    {
        $theme = app(ThemeInterface::class);
        $template = app('sleeping_owl.template');

        $this->assertSame('selector-theme', config('sleeping_owl.template.default'));
        $this->assertSame(
            SelectableContractTheme::class,
            config('sleeping_owl.template.themes.selector-theme')
        );
        $this->assertInstanceOf(SelectableContractTheme::class, $theme);
        $this->assertInstanceOf(ThemeTemplateAdapter::class, $template);
        $this->assertSame('selector-theme::contract', $template->getViewNamespace());
        $this->assertSame($theme, app('sleeping_owl')->theme());
        $this->assertSame($template, app('sleeping_owl')->template());
    }

    public function test_theme_configuration_keeps_names_and_values_unchanged(): void
    {
        $configuration = app(ThemeConfiguration::class);

        $this->assertSame(array_keys(self::THEME_CONFIG), $configuration->keys());
        $this->assertSame(self::THEME_CONFIG, $configuration->all());
        $this->assertSame(self::THEME_CONFIG, $configuration->toArray());
        $this->assertSame('fallback', $configuration->get('not-theme-owned', 'fallback'));
    }

    public function test_selected_theme_and_configuration_are_passed_to_theme_views(): void
    {
        $theme = app(ThemeInterface::class);
        $configuration = app(ThemeConfiguration::class);
        $view = app('sleeping_owl.template')->view('selection');

        $this->assertSame($theme, $view->getData()['theme']);
        $this->assertSame($configuration, $view->getData()['themeConfig']);
        $this->assertArrayHasKey('assetHealthStatus', $view->getData());
        $this->assertNull($view->getData()['assetHealthStatus']);

        $html = $view->render();
        $this->assertContainsAll($html, [
            'data-theme="selector-theme"',
            'data-body-class="custom-layout compact"',
            'data-breadcrumbs="no"',
            'data-favicon="/custom/favicon.svg"',
            'data-footer-visible="yes"',
            'data-has-many-card="yes"',
            'data-logo-mini="CU"',
            'data-menu-top="Custom menu"',
            'data-mode-visible="no"',
            'data-relation-card="no"',
            'data-sidebar-color="#102030"',
            'data-version="2026.9"',
            'data-version-visible="yes"',
            'data-wysiwyg-card="yes"',
            '&lt;svg data-logo=&quot;custom&quot;&gt;&lt;/svg&gt;',
            'Custom footer',
        ]);
    }

    public function test_selector_rejects_classes_without_a_theme_or_template_contract(): void
    {
        $this->expectException(TemplateException::class);
        $this->expectExceptionMessage(
            'Configured theme [stdClass] must implement ThemeInterface or TemplateInterface.'
        );

        (new ThemeResolver($this->app))->resolve(stdClass::class);
    }

    public function test_legacy_class_string_still_resolves(): void
    {
        $selection = (new ThemeResolver($this->app))->resolve(SelectableContractTheme::class);

        $this->assertInstanceOf(SelectableContractTheme::class, $selection->theme());
    }

    public function test_selector_rejects_an_unknown_default_name(): void
    {
        $this->expectException(TemplateException::class);
        $this->expectExceptionMessage(
            'Default theme [missing] is not defined in [sleeping_owl.template.themes].'
        );

        (new ThemeResolver($this->app))->resolve([
            'default' => 'missing',
            'themes' => ['selector-theme' => SelectableContractTheme::class],
        ]);
    }

    public function test_selector_rejects_a_malformed_theme_map(): void
    {
        $this->expectException(TemplateException::class);
        $this->expectExceptionMessage(
            'Configured class for theme [selector-theme] must be a non-empty class-string.'
        );

        (new ThemeResolver($this->app))->resolve([
            'default' => 'selector-theme',
            'themes' => ['selector-theme' => null],
        ]);
    }

    private function assertContainsAll(string $html, array $fragments): void
    {
        foreach ($fragments as $fragment) {
            $this->assertStringContainsString($fragment, $html);
        }
    }
}

final class SelectableContractTheme implements ThemeInterface
{
    public function id(): string
    {
        return 'selector-theme';
    }

    public function viewNamespace(): string
    {
        return 'selector-theme::contract';
    }

    public function assets(): array
    {
        return [];
    }

    public function icons(): array
    {
        return ['edit' => 'selector-edit'];
    }

    public function capabilities(): array
    {
        return ['icons', 'table-presentation'];
    }
}

final class UnselectedContractTheme implements ThemeInterface
{
    public function __construct()
    {
        throw new RuntimeException('An unselected theme must not be resolved.');
    }

    public function id(): string
    {
        return 'unused-theme';
    }

    public function viewNamespace(): string
    {
        return 'unused-theme::default';
    }

    public function assets(): array
    {
        return [];
    }

    public function icons(): array
    {
        return [];
    }

    public function capabilities(): array
    {
        return [];
    }
}
