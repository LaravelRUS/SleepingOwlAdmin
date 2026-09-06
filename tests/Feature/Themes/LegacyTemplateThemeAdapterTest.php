<?php

use Mockery as m;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;
use SleepingOwl\Admin\Templates\TemplateDefault;
use SleepingOwl\Admin\Themes\LegacyTemplateThemeAdapter;
use SleepingOwl\Admin\Themes\ThemeCapability;

class LegacyTemplateThemeAdapterTest extends TestCase
{
    public function test_default_template_is_available_through_the_theme_contract(): void
    {
        $template = $this->app->make('sleeping_owl.template');
        $theme = $this->app->make(ThemeInterface::class);

        $this->assertInstanceOf(TemplateDefault::class, $template);
        $this->assertInstanceOf(TemplateInterface::class, $template);
        $this->assertInstanceOf(LegacyTemplateThemeAdapter::class, $theme);
        $this->assertSame('legacy-adminlte', $theme->id());
        $this->assertSame(['shared:icons', 'theme:legacy-adminlte'], $theme->assets());
        $this->assertSame(
            array_map(fn (ThemeCapability $capability) => $capability->value, ThemeCapability::cases()),
            $theme->capabilities()
        );
        $this->assertSame($theme, $this->app->make('sleeping_owl.theme'));
        $this->assertSame($template, $theme->legacyTemplate());
        $this->assertSame($theme, $this->app->make('sleeping_owl')->theme());
    }

    public function test_adapter_exposes_only_narrow_theme_metadata(): void
    {
        $template = m::mock(TemplateInterface::class);
        $template->shouldReceive('getViewNamespace')
            ->once()
            ->andReturn('custom-admin::theme');

        $theme = new LegacyTemplateThemeAdapter(
            $template,
            'custom-admin',
            ['theme:custom-admin'],
            ['edit' => 'pencil'],
            ['tooltip', 'tabs']
        );

        $this->assertSame('custom-admin', $theme->id());
        $this->assertSame('custom-admin::theme', $theme->viewNamespace());
        $this->assertSame(['theme:custom-admin'], $theme->assets());
        $this->assertSame(['edit' => 'pencil'], $theme->icons());
        $this->assertSame(['tabs', 'tooltip'], $theme->capabilities());
        $this->assertSame($template, $theme->legacyTemplate());
    }

    public function test_legacy_adapter_does_not_change_template_initialization(): void
    {
        $template = m::mock(TemplateInterface::class);
        $template->shouldReceive('initialize')->once();

        $theme = new LegacyTemplateThemeAdapter($template);

        $theme->legacyTemplate()->initialize();

        $this->assertSame('legacy-template', $theme->id());
        $this->assertSame([], $theme->assets());
        $this->assertSame([], $theme->icons());
        $this->assertSame([], $theme->capabilities());
    }
}
