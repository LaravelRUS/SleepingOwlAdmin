<?php

class ApplicationViewOverrideTest extends TestCase
{
    protected function resolveApplicationConfiguration($app)
    {
        parent::resolveApplicationConfiguration($app);

        $app['config']->set('view.paths', [
            __DIR__.'/../../Fixtures/application-views',
        ]);
    }

    public function test_application_vendor_view_precedes_the_package_theme_view(): void
    {
        $logicalView = 'sleeping_owl::default._partials.tooltip';
        $path = view()->getFinder()->find($logicalView);
        $expected = __DIR__.'/../../Fixtures/application-views/vendor/sleeping_owl/default/_partials/tooltip.blade.php';
        $html = view($logicalView)->render();

        $this->assertSame(realpath($expected), realpath($path));
        $this->assertStringContainsString('class="application-tooltip-override"', $html);
        $this->assertStringContainsString('data-tooltip-content', $html);
        $this->assertStringNotContainsString('<div data-tooltip-popup', $html);
    }
}
