<?php

use Illuminate\Session\ArraySessionHandler;
use Illuminate\Session\Store;
use Illuminate\View\ViewException;
use SleepingOwl\Admin\Assets\AssetHealthStatus;
use SleepingOwl\Admin\Facades\Template as TemplateFacade;
use SleepingOwl\Admin\Form\Element\Wysiwyg;
use SleepingOwl\Admin\Form\Related\Forms\HasMany;
use SleepingOwl\Admin\Form\Related\Forms\HasManyLocal;
use SleepingOwl\Admin\Templates\TemplateDefault;

class LegacyThemeConfigurationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $session = new Store('theme-configuration', new ArraySessionHandler(120));
        $session->put('error_message', 'Error');
        $session->put('info_message', 'Info');
        $session->put('success_message', 'Success');
        $session->put('warning_message', 'Warning');
        $this->app->instance('session', $session);
        $this->app['request']->setLaravelSession($session);
    }

    public function test_legacy_layout_keeps_configured_brand_and_layout_values(): void
    {
        $this->configureLegacyLayout();
        $template = $this->bindLayoutTemplate();

        $html = $this->renderLayout($template);

        $this->assertContainsAll($html, [
            '<html lang="en" data-color-scheme="light">',
            '<link rel="stylesheet" href="/legacy-theme.css">',
            '<link rel="icon" href="/favicon.svg?tenant=main&amp;size=small">',
            '<style data-runtime-properties>',
            ':root[data-color-scheme="dark"] {',
            '--soa-sidebar-bg: #102030;',
            '<body class="legacy-layout compact">',
            '<svg data-contract="logo"></svg>',
            '<span class="logo-mini">',
            'LC',
            'Legacy configuration menu',
            'id="theme-mode"',
            '<footer class="main-footer small">',
            '<strong>Legacy footer</strong>',
            '<em>Legacy version</em>',
        ]);
        $this->assertGreaterThan(
            strpos($html, '<link rel="stylesheet" href="/legacy-theme.css">'),
            strpos($html, '<style data-runtime-properties>')
        );
    }

    public function test_legacy_layout_honours_hidden_optional_blocks(): void
    {
        $this->configureLegacyLayout();
        config()->set([
            'sleeping_owl.favicon' => null,
            'sleeping_owl.show_footer' => false,
            'sleeping_owl.show_mode' => false,
        ]);

        $html = $this->renderLayout($this->bindLayoutTemplate());

        $this->assertStringNotContainsString('<link rel="icon"', $html);
        $this->assertStringNotContainsString('<footer class="main-footer small">', $html);
        $this->assertStringNotContainsString('id="theme-mode"', $html);
    }

    public function test_asset_health_status_renders_when_the_optional_footer_is_hidden(): void
    {
        $this->configureLegacyLayout();
        config()->set('sleeping_owl.show_footer', false);
        $this->app->setLocale('en');

        $html = $this->renderLayout(
            $this->bindLayoutTemplate(),
            new AssetHealthStatus('12.1.0', '12.0.0')
        );

        $this->assertContainsAll($html, [
            '<footer class="main-footer small">',
            'class="asset-health-status" role="status"',
            'Published admin assets (12.0.0) do not match the installed package (12.1.0).',
            'Update assets:',
            '<code class="asset-health-command">php artisan sleepingowl:update</code>',
        ]);
        $this->assertStringNotContainsString('<strong>Legacy footer</strong>', $html);
        $this->assertStringNotContainsString('<em>Legacy version</em>', $html);
    }

    public function test_null_sidebar_color_does_not_emit_a_runtime_override(): void
    {
        $this->configureLegacyLayout();
        config()->set('sleeping_owl.sidebar_background_color', null);

        $html = $this->renderLayout($this->bindLayoutTemplate());

        $this->assertStringNotContainsString('data-runtime-properties', $html);
    }

    public function test_invalid_sidebar_color_is_rejected_before_css_rendering(): void
    {
        $this->configureLegacyLayout();
        config()->set('sleeping_owl.sidebar_background_color', '#fff; } body { color: red');

        $this->expectException(ViewException::class);
        $this->expectExceptionMessage('[sleeping_owl.sidebar_background_color]');

        $this->renderLayout($this->bindLayoutTemplate());
    }

    public function test_legacy_template_getters_keep_existing_config_keys(): void
    {
        config()->set([
            'sleeping_owl.logo' => '<svg data-contract="actual-logo"></svg>',
            'sleeping_owl.logo_mini' => 'AL',
            'sleeping_owl.menu_top' => 'Actual legacy menu',
            'sleeping_owl.version_text' => 'Actual legacy version',
        ]);

        $template = $this->app->make(TemplateDefault::class);

        $this->assertSame('<svg data-contract="actual-logo"></svg>', $template->getLogo());
        $this->assertSame('AL', $template->getLogoMini());
        $this->assertSame('Actual legacy menu', $template->getMenuTop());
        $this->assertSame('Actual legacy version', $template->getVersion());
    }

    public function test_legacy_card_flags_keep_form_view_modes(): void
    {
        config()->set('sleeping_owl.useWysiwygCard', true);
        $this->assertSame('form.element.wysiwyg', $this->wysiwyg()->getView());

        config()->set('sleeping_owl.useWysiwygCard', false);
        $this->assertSame('form.element.wysiwyg_without_card', $this->wysiwyg()->getView());

        config()->set('sleeping_owl.useRelationCard', true);
        $this->assertSame('form.element.related.elements', (new HasMany('items'))->getView());

        config()->set('sleeping_owl.useRelationCard', false);
        $this->assertSame('form.element.related.elements_without_card', (new HasMany('items'))->getView());

        config()->set('sleeping_owl.useHasManyLocalCard', true);
        $this->assertSame('form.element.related.elements', (new HasManyLocal('items'))->getView());

        config()->set('sleeping_owl.useHasManyLocalCard', false);
        $this->assertSame('form.element.related.elements_without_card', (new HasManyLocal('items'))->getView());
    }

    private function configureLegacyLayout(): void
    {
        config()->set([
            'sleeping_owl.body_default_class' => 'legacy-layout compact',
            'sleeping_owl.breadcrumbs' => false,
            'sleeping_owl.datatables_settings.dt_autoupdate' => false,
            'sleeping_owl.favicon' => '/favicon.svg?tenant=main&size=small',
            'sleeping_owl.footer_text' => '<strong>Legacy footer</strong>',
            'sleeping_owl.logo' => '<svg data-contract="logo"></svg>',
            'sleeping_owl.logo_mini' => 'LC',
            'sleeping_owl.menu_top' => 'Legacy configuration menu',
            'sleeping_owl.scroll_to_bottom' => false,
            'sleeping_owl.scroll_to_top' => false,
            'sleeping_owl.show_footer' => true,
            'sleeping_owl.show_mode' => true,
            'sleeping_owl.show_version' => true,
            'sleeping_owl.sidebar_background_color' => '#102030',
            'sleeping_owl.datatables_settings.state_datatables' => false,
            'sleeping_owl.datatables_settings.state_filters' => false,
            'sleeping_owl.state_tabs' => false,
            'sleeping_owl.url_prefix' => 'admin',
            'sleeping_owl.version_text' => '<em>Legacy version</em>',
        ]);
    }

    private function bindLayoutTemplate(): LegacyThemeConfigurationTemplateStub
    {
        $template = new LegacyThemeConfigurationTemplateStub();
        $this->app->instance('sleeping_owl.template', $template);
        TemplateFacade::swap($template);

        return $template;
    }

    private function renderLayout(
        LegacyThemeConfigurationTemplateStub $template,
        ?AssetHealthStatus $assetHealthStatus = null
    ): string {
        return view('sleeping_owl::default._layout.inner', [
            'assetHealthStatus' => $assetHealthStatus,
            'breadcrumbKey' => 'theme-config',
            'content' => '<section data-contract="content">Content</section>',
            'pages' => [],
            'template' => $template,
            'title' => 'Theme configuration',
        ])->render();
    }

    private function wysiwyg(): Wysiwyg
    {
        return new Wysiwyg('content', 'Content', 'ckeditor');
    }

    private function assertContainsAll(string $html, array $fragments): void
    {
        foreach ($fragments as $fragment) {
            $this->assertStringContainsString($fragment, $html);
        }
    }
}

final class LegacyThemeConfigurationTemplateStub
{
    public function getViewPath(string $view): string
    {
        if (str_contains($view, '::')) {
            return $view;
        }

        return "sleeping_owl::default.{$view}";
    }

    public function view(string $view, array $data = [])
    {
        $data['template'] = $this;

        return view($this->getViewPath($view), $data);
    }

    public function renderMeta(string $title): string
    {
        return '<meta data-contract="meta"><link rel="stylesheet" href="/legacy-theme.css">';
    }

    public function renderBreadcrumbs(string $key): string
    {
        return '';
    }

    public function renderNavigation(): string
    {
        return '';
    }

    public function getLogo(): string
    {
        return config('sleeping_owl.logo');
    }

    public function getLogoMini(): string
    {
        return config('sleeping_owl.logo_mini');
    }

    public function getMenuTop(): string
    {
        return config('sleeping_owl.menu_top');
    }

    public function getVersion(): string
    {
        return config('sleeping_owl.version_text');
    }

    public function meta(): LegacyThemeConfigurationMetaStub
    {
        return new LegacyThemeConfigurationMetaStub();
    }
}

final class LegacyThemeConfigurationMetaStub
{
    public function renderScripts(bool $footer): string
    {
        return '<span data-contract="scripts"></span>';
    }
}
