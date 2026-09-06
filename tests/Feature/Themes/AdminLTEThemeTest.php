<?php

use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;
use SleepingOwl\Admin\Themes\AdminLTETheme;
use SleepingOwl\Admin\Themes\ThemeAssetManifest;
use SleepingOwl\Admin\Themes\ThemeCapability;

class AdminLTEThemeTest extends TestCase
{
    public function test_it_is_the_default_direct_theme_and_template(): void
    {
        $theme = $this->app->make(ThemeInterface::class);
        $template = $this->app->make('sleeping_owl.template');

        $this->assertSame(AdminLTETheme::class, config('sleeping_owl.template'));
        $this->assertInstanceOf(AdminLTETheme::class, $theme);
        $this->assertInstanceOf(TemplateInterface::class, $theme);
        $this->assertSame($theme, $template);
        $this->assertSame($theme, $this->app->make('sleeping_owl')->theme());
        $this->assertSame('legacy-adminlte', $theme->id());
        $this->assertSame('sleeping_owl::default', $theme->viewNamespace());
    }

    public function test_it_declares_shared_icons_theme_and_component_adapters(): void
    {
        $manifest = ThemeAssetManifest::fromTheme($this->app->make(AdminLTETheme::class));

        $this->assertSame([
            'shared:icons',
            'theme:legacy-adminlte',
            'feature:dropdown:theme:legacy-adminlte',
            'feature:lightbox:theme:legacy-adminlte',
            'feature:sidebar:theme:legacy-adminlte',
            'feature:table:theme:legacy-adminlte',
            'feature:tabs:theme:legacy-adminlte',
            'feature:tooltip:theme:legacy-adminlte',
            'feature:tree:theme:legacy-adminlte',
        ], $manifest->entries());
        $this->assertSame([
            'shared:icons',
            'theme:legacy-adminlte',
            'feature:tabs:theme:legacy-adminlte',
            'feature:table:theme:legacy-adminlte',
        ], $manifest->entriesFor(['tabs', 'table']));
    }

    public function test_it_exposes_existing_adminlte_capabilities_without_icon_remapping(): void
    {
        $theme = $this->app->make(AdminLTETheme::class);

        $this->assertSame([], $theme->icons());
        $this->assertSame(
            array_map(
                fn (ThemeCapability $capability): string => $capability->value,
                ThemeCapability::cases()
            ),
            $theme->capabilities()
        );
    }
}
