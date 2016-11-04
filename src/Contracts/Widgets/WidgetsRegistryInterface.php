<?php

namespace SleepingOwl\Admin\Contracts\Widgets;

interface WidgetsRegistryInterface
{
    /**
     * @param $widget
     *
     * @return $this
     */
    public function registerWidget($widget);

    /**
     * @param \Illuminate\Contracts\View\Factory $factory
     *
     * @return void
     */
    public function placeWidgets(\Illuminate\Contracts\View\Factory $factory);
}
