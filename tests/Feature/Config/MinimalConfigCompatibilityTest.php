<?php

use SleepingOwl\Admin\Templates\TemplateDefault;

class MinimalConfigCompatibilityTest extends TestCase
{
    private array $minimalConfig = [];

    protected function resolveApplicationConfiguration($app)
    {
        parent::resolveApplicationConfiguration($app);

        $this->minimalConfig = require __DIR__.'/../../Fixtures/config/sleeping_owl_minimal.php';
        $app['config']->set('sleeping_owl', $this->minimalConfig);
    }

    public function test_package_keeps_the_only_user_value_and_fills_required_defaults(): void
    {
        $config = config('sleeping_owl');

        $this->assertSame(['title' => 'Minimal Admin'], $this->minimalConfig);
        $this->assertSame('Minimal Admin', $config['title']);
        $this->assertSame('SO', $config['ui']['logo_mini']);
        $this->assertSame('admin', $config['url_prefix']);
        $this->assertFalse($config['dev_assets']);
        $this->assertFalse($config['env']['enabled']);
        $this->assertTrue($config['ui']['show_mode']);
        $this->assertIsArray($config['datatables']);
        $this->assertIsArray($config['datatables_settings']);
        $this->assertArrayHasKey('AdminTemplate', $config['aliases']);
    }

    public function test_package_services_and_default_views_load_with_minimal_config(): void
    {
        $this->assertInstanceOf(TemplateDefault::class, app('sleeping_owl.template'));
        $this->assertTrue(view()->exists('sleeping_owl::default._layout.inner'));
        $this->assertTrue(view()->exists('sleeping_owl::default.form.element.text'));
        $this->assertTrue(view()->exists('sleeping_owl::default.display.table'));
    }
}
