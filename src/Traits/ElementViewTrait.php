<?php

namespace SleepingOwl\Admin\Traits;

use Closure;

trait ElementViewTrait
{
    /**
     * @var string|\Illuminate\View\View
     */
    protected $view;

    /**
     * @return string|\Illuminate\View\View
     */
    public function getView()
    {
        return $this->view;
    }

    /**
     * @param string|\Illuminate\View\View $view
     *
     * @return $this
     */
    public function setView($view)
    {
        $this->view = $view;

        return $this;
    }
}
