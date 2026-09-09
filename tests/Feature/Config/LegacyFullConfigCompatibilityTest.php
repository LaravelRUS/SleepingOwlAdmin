<?php

use SleepingOwl\Admin\Facades\Assets;
use SleepingOwl\Admin\Facades\Meta;
use SleepingOwl\Admin\Facades\PackageManager;
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
        $this->assertSame('admin', $config['url_prefix']);
        $this->assertFalse($config['domain']);
        $this->assertSame(['web', 'admin'], $config['middleware']);
        $this->assertSame('app/Admin', $config['bootstrapDirectory']);
        $this->assertSame('images/uploads', $config['imagesUploadDirectory']);
        $this->assertSame('files/uploads', $config['filesUploadDirectory']);
        $this->assertSame('POST', $config['datatables_settings']['default_datatables_method']);
        $this->assertSame('d-m-Y H:i', $config['datetimeFormat']);
        $this->assertSame('d-m-Y', $config['dateFormat']);
        $this->assertSame('H:i', $config['timeFormat']);
        $this->assertSame('UTC', $config['timezone']);
        $this->assertSame('ckeditor', $config['wysiwyg']['default']);
        $this->assertSame(
            Assets::class,
            $config['aliases']['Assets']
        );
        $this->assertSame(Meta::class, $config['aliases']['Meta']);
        $this->assertSame(PackageManager::class, $config['aliases']['PackageManager']);
        $this->assertSame(
            'KodiCMS\\Assets\\Facades\\Assets',
            $this->legacyConfig['aliases']['Assets']
        );
    }

    public function test_package_supplies_defaults_for_keys_absent_from_legacy_config(): void
    {
        $this->assertArrayNotHasKey('dev_assets', $this->legacyConfig);
        $this->assertArrayNotHasKey('show_color_mode_toggle', $this->legacyConfig);

        $this->assertFalse(config('sleeping_owl.dev_assets'));
        $this->assertArrayNotHasKey('env', config('sleeping_owl'));
        $this->assertTrue(config('sleeping_owl.ui.show_color_mode_toggle'));
        $this->assertNull(config('sleeping_owl.ui.sidebar_background_color'));
    }

    public function test_package_services_and_default_views_load_with_legacy_config(): void
    {
        $this->assertInstanceOf(TemplateDefault::class, app('sleeping_owl.template'));
        $this->assertTrue(view()->exists('sleeping_owl::default._layout.inner'));
        $this->assertTrue(view()->exists('sleeping_owl::default.form.element.multiselect'));
        $this->assertTrue(view()->exists('sleeping_owl::default.display.table'));
    }
}
