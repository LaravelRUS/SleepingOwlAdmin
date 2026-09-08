<?php

namespace SleepingOwl\Admin\Themes;

use Illuminate\Contracts\Foundation\Application;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Contracts\Navigation\NavigationInterface;
use SleepingOwl\Admin\Contracts\Template\MetaInterface;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;
use SleepingOwl\Admin\Templates\Breadcrumbs;
use SleepingOwl\Admin\Templates\Template;

/**
 * Transitional rendering bridge for a direct ThemeInterface implementation.
 */
final class ThemeTemplateAdapter extends Template
{
    public function __construct(
        Application $application,
        AdminInterface $admin,
        MetaInterface $meta,
        NavigationInterface $navigation,
        Breadcrumbs $breadcrumbs,
        private ThemeInterface $theme
    ) {
        parent::__construct($application, $admin, $meta, $navigation, $breadcrumbs);
    }

    public function initialize(): void
    {
        $this->app->make(ThemeRuntimeAssets::class)->register($this->theme);
    }

    public function name(): string
    {
        return $this->theme->id();
    }

    public function version(): string
    {
        return '';
    }

    public function homepage(): string
    {
        return '';
    }

    public function getViewNamespace(): string
    {
        return $this->theme->viewNamespace();
    }

    public function assetDir(): string
    {
        return '';
    }

    public function getLogo(): mixed
    {
        return config('sleeping_owl.logo');
    }

    public function getLogoMini(): mixed
    {
        return config('sleeping_owl.logo_mini');
    }

    public function getMenuTop(): mixed
    {
        return config('sleeping_owl.menu_top');
    }
}
