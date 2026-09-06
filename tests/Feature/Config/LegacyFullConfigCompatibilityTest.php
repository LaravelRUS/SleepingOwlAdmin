<?php

use SleepingOwl\Admin\Templates\TemplateDefault;

class LegacyFullConfigCompatibilityTest extends TestCase
{
    private array $legacyConfig = [];

    protected function resolveApplicationConfiguration($app)
    {
        parent::resolveApplicationConfiguration($app);

        $this->legacyConfig = require __DIR__.'/../../Fixtures/config/sleeping_owl_legacy_full.php';
        $app['config']->set('sleeping_owl', $this->legacyConfig);
    }

    public function test_package_merges_defaults_without_replacing_legacy_values(): void
    {
        $config = config('sleeping_owl');

        $this->assertSame('Legacy Admin', $config['title']);
        $this->assertSame('POST', $config['default_datatables_method']);
        $this->assertSame('d-m-Y H:i', $config['datetimeFormat']);
        $this->assertSame('ckeditor', $config['wysiwyg']['default']);
        $this->assertSame(
            'KodiCMS\\Assets\\Facades\\Assets',
            $config['aliases']['Assets']
        );
    }

    public function test_package_supplies_defaults_for_keys_absent_from_legacy_config(): void
    {
        $this->assertArrayNotHasKey('dev_assets', $this->legacyConfig);
        $this->assertArrayNotHasKey('enable_editor', $this->legacyConfig);
        $this->assertArrayNotHasKey('show_mode', $this->legacyConfig);

        $this->assertFalse(config('sleeping_owl.dev_assets'));
        $this->assertFalse(config('sleeping_owl.enable_editor'));
        $this->assertTrue(config('sleeping_owl.show_mode'));
        $this->assertNull(config('sleeping_owl.sidebar_background_color'));
    }

    public function test_package_services_and_default_views_load_with_legacy_config(): void
    {
        $this->assertInstanceOf(TemplateDefault::class, app('sleeping_owl.template'));
        $this->assertTrue(view()->exists('sleeping_owl::default._layout.inner'));
        $this->assertTrue(view()->exists('sleeping_owl::default.form.element.multiselect'));
        $this->assertTrue(view()->exists('sleeping_owl::default.display.table'));
    }
}
