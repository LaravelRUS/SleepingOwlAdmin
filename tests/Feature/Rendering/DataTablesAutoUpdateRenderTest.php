<?php

class DataTablesAutoUpdateRenderTest extends TestCase
{
    public function test_view_uses_normalized_auto_update_config(): void
    {
        config()->set([
            'sleeping_owl.dt_autoupdate' => true,
            'sleeping_owl.dt_autoupdate_class' => 'project-orders',
            'sleeping_owl.dt_autoupdate_color' => '#123456',
            'sleeping_owl.dt_autoupdate_interval' => 2,
        ]);

        $html = view('sleeping_owl::features.datatables.autoupdate')->render();

        $this->assertStringContainsString('data-admin-table-autoupdate', $html);
        $this->assertStringContainsString('data-table-class="project-orders"', $html);
        $this->assertStringContainsString('data-interval="120000"', $html);
        $this->assertStringContainsString(
            'style="--soa-datatables-autoupdate-color: #123456"',
            $html
        );
        $this->assertStringContainsString('<template data-admin-table-autoupdate-control>', $html);
        $this->assertStringContainsString('data-admin-table-autoupdate-close', $html);
        $this->assertStringContainsString('class="autoupdater-close"', $html);
        $this->assertStringContainsString('aria-hidden="true">×</span>', $html);
        $this->assertStringNotContainsString('<script', $html);
    }

    public function test_historical_theme_view_renders_the_feature_control_template(): void
    {
        config()->set('sleeping_owl.dt_autoupdate', true);

        $html = view('sleeping_owl::default.helper.autoupdate')->render();

        $this->assertStringContainsString('data-admin-table-autoupdate', $html);
        $this->assertStringContainsString('data-admin-table-autoupdate-control', $html);
        $this->assertStringContainsString('data-admin-table-autoupdate-close', $html);
    }

    public function test_disabled_auto_update_renders_no_script(): void
    {
        config()->set('sleeping_owl.dt_autoupdate', false);

        $html = view('sleeping_owl::features.datatables.autoupdate')->render();

        $this->assertStringNotContainsString('<script', $html);
        $this->assertStringNotContainsString('data-admin-table-autoupdate-control', $html);
    }
}
