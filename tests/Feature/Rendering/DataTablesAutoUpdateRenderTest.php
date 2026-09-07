<?php

class DataTablesAutoUpdateRenderTest extends TestCase
{
    public function test_view_uses_normalized_auto_update_config(): void
    {
        config()->set([
            'sleeping_owl.datatables_settings.dt_autoupdate' => true,
            'sleeping_owl.datatables_settings.dt_autoupdate_class' => 'project-orders',
            'sleeping_owl.datatables_settings.dt_autoupdate_color' => 'black',
            'sleeping_owl.datatables_settings.dt_autoupdate_interval' => 120,
        ]);

        $html = view('sleeping_owl::features.datatables.autoupdate')->render();

        $this->assertStringContainsString('data-admin-table-autoupdate', $html);
        $this->assertStringContainsString(
            'data-table-classes="[&quot;project-orders&quot;,&quot;autoupdate&quot;]"',
            $html
        );
        $this->assertStringContainsString('data-interval="120000"', $html);
        $this->assertStringContainsString(
            'style="--soa-datatables-autoupdate-color: black"',
            $html
        );
        $this->assertStringContainsString('<template data-admin-table-autoupdate-control>', $html);
        $this->assertStringContainsString('data-admin-table-autoupdate-bar', $html);
        $this->assertStringContainsString('data-admin-table-autoupdate-toggle', $html);
        $this->assertStringContainsString('class="autoupdater-toggle autoupdater-close"', $html);
        $this->assertStringContainsString('data-admin-table-autoupdate-pause-icon', $html);
        $this->assertStringContainsString('data-admin-table-autoupdate-resume-icon', $html);
        $this->assertStringNotContainsString('<script', $html);
    }

    public function test_historical_theme_view_renders_the_feature_control_template(): void
    {
        config()->set('sleeping_owl.datatables_settings.dt_autoupdate', true);

        $html = view('sleeping_owl::default.helper.autoupdate')->render();

        $this->assertStringContainsString('data-admin-table-autoupdate', $html);
        $this->assertStringContainsString('data-admin-table-autoupdate-control', $html);
        $this->assertStringContainsString('data-admin-table-autoupdate-toggle', $html);
    }

    public function test_disabled_auto_update_renders_no_script(): void
    {
        config()->set('sleeping_owl.datatables_settings.dt_autoupdate', false);

        $html = view('sleeping_owl::features.datatables.autoupdate')->render();

        $this->assertStringNotContainsString('<script', $html);
        $this->assertStringNotContainsString('data-admin-table-autoupdate-control', $html);
    }
}
