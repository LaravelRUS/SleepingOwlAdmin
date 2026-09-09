<?php

use Illuminate\Session\ArraySessionHandler;
use Illuminate\Session\Store;
use SleepingOwl\Admin\Assets\AssetHealthStatus;
use SleepingOwl\Admin\Themes\TailwindTheme;
use SleepingOwl\Admin\Widgets\Messages\ErrorMessages;

class TailwindThemeShellTest extends TestCase
{
    protected function resolveApplicationConfiguration($app)
    {
        parent::resolveApplicationConfiguration($app);

        $app['config']->set('sleeping_owl.template', TailwindTheme::class);
    }

    protected function setUp(): void
    {
        parent::setUp();

        config()->set([
            'sleeping_owl.ui.body_default_class' => 'sidebar-mini sidebar-open project-body',
            'sleeping_owl.ui.breadcrumbs' => false,
            'sleeping_owl.datatables_settings.autoupdate' => [],
            'sleeping_owl.datatables_settings.state_datatables' => false,
            'sleeping_owl.datatables_settings.state_filters' => false,
            'sleeping_owl.ui.favicon' => null,
            'sleeping_owl.ui.footer_text' => 'Contract footer',
            'sleeping_owl.ui.logo' => '<strong>Sleeping Owl</strong>',
            'sleeping_owl.ui.logo_mini' => 'SO',
            'sleeping_owl.ui.menu_top' => 'Operations',
            'sleeping_owl.ui.scroll_to_bottom' => false,
            'sleeping_owl.ui.scroll_to_top' => false,
            'sleeping_owl.ui.show_footer' => true,
            'sleeping_owl.ui.show_color_mode_toggle' => true,
            'sleeping_owl.ui.show_version' => true,
            'sleeping_owl.datatables_settings.state_tabs' => false,
            'sleeping_owl.url_prefix' => 'admin',
        ]);
    }

    public function test_direct_theme_renders_the_shell_and_public_behavior_hooks(): void
    {
        $session = app('session')->driver();
        foreach (['error', 'info', 'success', 'warning'] as $type) {
            $session->put("{$type}_message", ucfirst($type));
        }
        $template = app('sleeping_owl.template');
        $html = $template->view('_layout.inner', [
            'breadcrumbKey' => 'tailwind-shell',
            'content' => '<section data-contract="content">Body</section>',
            'title' => 'Operations ledger',
        ])->render();

        $this->assertContainsAll($html, [
            '<body class="soa-body sidebar-mini sidebar-open project-body">',
            '<div class="app-wrapper soa-app" id="vueApp">',
            '<nav class="app-header navbar navbar-expand bg-body soa-header">',
            'data-widget="pushmenu"',
            'data-lte-toggle="sidebar"',
            'id="theme-mode"',
            'data-toggle="tooltip"',
            '<aside class="app-sidebar main-sidebar shadow soa-sidebar" data-bs-theme="dark">',
            'data-widget="treeview"',
            'data-lte-toggle="treeview"',
            '<main class="app-main soa-main">',
            '<h1 class="soa-page-title">',
            'Operations ledger',
            '<section data-contract="content">Body</section>',
            '<footer class="app-footer main-footer small soa-footer">',
            '<template data-tooltip-template>',
            '<div class="soa-tooltip" data-tooltip-popup role="tooltip">',
            '<div class="soa-sidebar-overlay" id="sidebar-overlay"></div>',
        ]);
        $this->assertStringNotContainsString('asset-health-status', $html);
    }

    public function test_asset_health_partial_uses_locale_fallback(): void
    {
        $this->app['translator']->setFallback('en');
        $this->app->setLocale('fr');

        $html = view('sleeping_owl_shadcn::default._partials.asset_health', [
            'status' => new AssetHealthStatus('12.1.0', '12.0.0'),
        ])->render();

        $this->assertContainsAll($html, [
            'class="asset-health-status soa-asset-health" role="status"',
            'Published admin assets (12.0.0) do not match the installed package (12.1.0).',
            '<code class="asset-health-command soa-asset-health-command">php artisan sleepingowl:update</code>',
        ]);
    }

    public function test_navigation_parent_preserves_driver_structure_and_user_attributes(): void
    {
        $child = new TailwindShellRenderable('<li data-contract="child">Child</li>');
        $badge = new TailwindShellRenderable('<small class="badge">3</small>');

        $html = view('sleeping_owl_shadcn::default._partials.navigation.page', [
            'attributesArray' => [
                'aria-label' => 'Orders',
                'class' => 'project-link',
                'data-contract' => 'parent',
            ],
            'badges' => collect([$badge]),
            'hasChild' => true,
            'icon' => '<i class="fas fa-box"></i>',
            'isActive' => true,
            'pages' => [$child],
            'title' => 'Order management queue',
            'url' => '/unused',
        ])->render();

        $this->assertContainsAll($html, [
            '<li class="nav-item soa-nav-item menu-open">',
            'class="nav-link soa-nav-link active has-child project-link"',
            'aria-label="Orders"',
            'aria-expanded="true"',
            'aria-haspopup="true"',
            'data-contract="parent"',
            'title="Order management queue"',
            '<ul class="nav nav-treeview soa-nav-children">',
            '<li data-contract="child">Child</li>',
        ]);
        $this->assertStringNotContainsString('<ul class="nav nav-treeview soa-nav-children" hidden>', $html);
    }

    public function test_message_uses_the_ledger_rail_and_keeps_alert_dismiss_hooks(): void
    {
        $session = new Store('tailwind-shell', new ArraySessionHandler(120));
        $session->put('error_message', '<strong>Request failed</strong>');
        $this->app->instance('session', $session);

        $html = (new ErrorMessages())->toHtml();

        $this->assertContainsAll($html, [
            'alert alert-error alert-danger alert-message',
            'soa-alert',
            'role="alert"',
            'fas fa-times fa-lg',
            '<strong>Request failed</strong>',
            'data-bs-dismiss="alert"',
            'data-dismiss="alert"',
        ]);
        $this->assertFalse($session->has('error_message'));
    }

    private function assertContainsAll(string $html, array $fragments): void
    {
        foreach ($fragments as $fragment) {
            $this->assertStringContainsString($fragment, $html);
        }
    }
}

final class TailwindShellRenderable
{
    public function __construct(private string $html)
    {
    }

    public function render(): string
    {
        return $this->html;
    }
}
