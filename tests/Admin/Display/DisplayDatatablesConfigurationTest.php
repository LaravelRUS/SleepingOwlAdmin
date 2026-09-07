<?php

use SleepingOwl\Admin\Display\DisplayDatatables;
use SleepingOwl\Admin\Display\DisplayDatatablesAsync;

class DisplayDatatablesConfigurationTest extends TestCase
{
    public function test_local_datatables_options_override_global_options(): void
    {
        config()->set('sleeping_owl.datatables', [
            'pageLength' => 20,
            'responsive' => true,
            'searchBuilder' => ['depthLimit' => 2],
        ]);
        $display = (new DisplayDatatables())->setDatatableAttributes([
            'pageLength' => 50,
            'projectExtension' => ['mode' => 'compact'],
        ]);

        $this->assertSame([
            'pageLength' => 50,
            'responsive' => true,
            'searchBuilder' => ['depthLimit' => 2],
            'projectExtension' => ['mode' => 'compact'],
        ], $display->getDatatableAttributes());
    }

    public function test_async_display_uses_configured_request_method(): void
    {
        config()->set('sleeping_owl.datatables_settings.default_datatables_method', 'POST');

        $this->assertSame('POST', (new DisplayDatatablesAsync())->getMethod());
    }

    public function test_explicit_request_method_overrides_the_config_default(): void
    {
        config()->set('sleeping_owl.datatables_settings.default_datatables_method', 'POST');
        $display = (new DisplayDatatablesAsync())->setMethod('PATCH');

        $this->assertSame('PATCH', $display->getMethod());
    }
}
