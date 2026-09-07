<?php

use SleepingOwl\Tests\Helpers\InteractsWithJsonProps;

class ApplicationViewOverrideTest extends TestCase
{
    use InteractsWithJsonProps;

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

    public function test_application_form_override_changes_nesting_and_vue_classes(): void
    {
        $logicalView = 'sleeping_owl::default.form.element.image';
        $path = view()->getFinder()->find($logicalView);
        $expected = __DIR__.'/../../Fixtures/application-views/vendor/sleeping_owl/default/form/element/image.blade.php';
        $html = view($logicalView)->render();
        $props = $this->extractJsonProps($html);

        $this->assertSame(realpath($expected), realpath($path));
        $this->assertMatchesRegularExpression(
            '/<section[^>]+data-application-image-override>\s*<div class="application-image-nesting">\s*<article/s',
            $html
        );
        $this->assertSame('application-image-current', $props['classes']['current']);
        $this->assertSame('application-image-insert-current', $props['classes']['insertCurrentButton']);
        $this->assertTrue($props['onlyLink']);
        $this->assertStringNotContainsString('form-group form-element-image', $html);
        $this->assertStringNotContainsString('data-soa-', $html);
    }
}
