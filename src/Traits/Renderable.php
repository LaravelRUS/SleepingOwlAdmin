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
     * @var string
     */
    protected $viewPathPostfix = '';

    /**
     * @param  string|View  $view
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
            $view_postfix = $this->getViewMode() ? '_'.$this->getViewMode() : '';

            return is_string($this->view) && $view_postfix ? $this->view.$view_postfix : $this->view;
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

    /**
     * @return string
     */
    public function getViewMode(): string
    {
        return $this->viewPathPostfix;
    }

    /**
     * @param  string  $viewPathPostfix
     * @return Renderable
     */
    public function setViewMode(string $viewPathPostfix): self
    {
        $this->viewPathPostfix = $viewPathPostfix;

        return $this;
    }

    /**
     * @return Renderable
     */
    public function defaultViewMode(): self
    {
        $this->viewPathPostfix = '';

        return $this;
    }
}
