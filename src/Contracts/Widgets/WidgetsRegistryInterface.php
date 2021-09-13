<?php

namespace SleepingOwl\Admin\Contracts\Widgets;

use Illuminate\Contracts\View\Factory;

interface WidgetsRegistryInterface
{
    /**
     * @param $widget
     * @return $this
     */
    public function registerWidget($widget);

    /**
     * @param  \Illuminate\Contracts\View\Factory  $factory
     * @return void
     */
    public function placeWidgets(Factory $factory);
}
