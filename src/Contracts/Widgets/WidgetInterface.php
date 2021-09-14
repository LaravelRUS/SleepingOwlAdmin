<?php

namespace SleepingOwl\Admin\Contracts\Widgets;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Contracts\View\View;

interface WidgetInterface extends Arrayable, Htmlable
{
    /**
     * @return bool
     */
    public function active();

    /**
     * @return int
     */
    public function position();

    /**
     * @return string|array
     */
    public function template();

    /**
     * @return string
     */
    public function block();

    /**
     * @param  View  $view
     * @return void
     */
    public function setInjectableView(View $view);
}
