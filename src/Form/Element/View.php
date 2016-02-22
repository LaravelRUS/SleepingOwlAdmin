<?php

namespace SleepingOwl\Admin\Form\Element;

class View extends Custom
{
    /**
     * @var string
     */
    protected $view;

    /**
     * @param string $view
     */
    public function __construct($view)
    {
        $this->setView($view);
    }

    /**
     * @return string
     */
    public function getView()
    {
        return $this->view;
    }

    /**
     * @param string $view
     *
     * @return $this
     */
    public function setView($view)
    {
        $this->view = $view;

        $this->setDisplay(function ($model) {
            return view($this->getView(), ['model' => $model]);
        });

        return $this;
    }

    public function save()
    {
        $callback = $this->getCallback();
        if (is_callable($callback)) {
            call_user_func($callback, $this->getModel());
        }
    }
}
