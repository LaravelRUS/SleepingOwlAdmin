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

        $this->assertStringContainsString(
            "const autoupdateSelector = '.datatables.project-orders';",
            $html
        );
        $this->assertStringContainsString('duration: 120000', $html);
        $this->assertStringContainsString("color: '#123456'", $html);
        $this->assertStringContainsString("' + 2 + ' min.'", $html);
    }

    public function test_disabled_auto_update_renders_no_script(): void
    {
        config()->set('sleeping_owl.dt_autoupdate', false);

        $html = view('sleeping_owl::features.datatables.autoupdate')->render();

        $this->assertStringNotContainsString('<script', $html);
    }
}
