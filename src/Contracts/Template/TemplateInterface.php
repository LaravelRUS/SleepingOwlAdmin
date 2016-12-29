<?php

namespace SleepingOwl\Admin\Contracts\Template;

use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\Navigation\NavigationInterface;

interface TemplateInterface extends Initializable
{
    /**
     * @return string
     */
    public function getViewNamespace();

    /**
     * @param string $view
     *
     * @return string
     */
    public function getViewPath($view);

    /**
     * @param string|\Illuminate\View\View $view
     * @param array  $data
     * @param array  $mergeData
     *
     * @return \BladeView|bool|\Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function view($view, array $data = [], $mergeData = []);

    /**
     * @param string $key
     *
     * @return string
     */
    public function renderBreadcrumbs($key);

    /**
     * @return \DaveJamesMiller\Breadcrumbs\Manager
     */
    public function breadcrumbs();

    /**
     * @return MetaInterface
     */
    public function meta();

    /**
     * @param string $title
     *
     * @return string
     */
    public function renderMeta($title);

    /**
     * @return NavigationInterface
     */
    public function navigation();

    /**
     * @return string
     */
    public function renderNavigation();
}
