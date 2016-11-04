<?php

namespace SleepingOwl\Admin\Widgets;

use SleepingOwl\Admin\Contracts\Widgets\WidgetInterface;
use Illuminate\Contracts\View\View;

abstract class Widget implements WidgetInterface
{
    /**
     * @var \Illuminate\View\View
     */
    protected $view;

    /**
     * @return boolean
     */
    public function active()
    {
        return true;
    }

    /**
     * @return integer
     */
    public function position()
    {
        return 0;
    }

    /**
     * @param View $view
     */
    public function setInjectableView(View $view)
    {
        $this->view = $view;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'block' => $this->block(),
            'template' => $this->template(),
            'html' => $this->toHtml(),
            'position' => $this->position(),
        ];
    }
}