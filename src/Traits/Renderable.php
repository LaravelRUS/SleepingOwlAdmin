<?php

namespace SleepingOwl\Admin\Traits;

use Illuminate\View\View;

trait Renderable
{
    /**
     * @var string
     */
    protected $viewPath;

    /**
     * @param string|View $view
     *
     * @return $this
     */
    public function setView($view)
    {
        $this->viewPath = $view;

        return $this;
    }

    /**
     * @return View|string
     */
    public function getView()
    {
        if (empty($this->viewPath) && property_exists($this, 'view')) {
            return $this->view;
        }

        return $this->viewPath;
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->render();
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        return app('sleeping_owl.template')->view(
            $this->getView(),
            $this->toArray()
        );
    }
}
