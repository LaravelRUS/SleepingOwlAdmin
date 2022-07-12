<?php

namespace SleepingOwl\Admin\Form\Element;

use Closure;

class View extends Custom
{
    /**
     * @var string
     */
    protected string $view;

    /**
     * @var array
     */
    protected array $data = [];

    /**
     * @param string $view
     * @param array $data
     * @param Closure|null $callback
     */
    public function __construct($view, array $data = [], Closure $callback = null)
    {
        $this->setView($view);
        $this->setData($data);

        parent::__construct($callback);
    }

    /**
     * @return string
     */
    public function getView(): string
    {
        return $this->view;
    }

    /**
     * @param  string  $view
     * @return $this
     */
    public function setView($view): View
    {
        $this->view = $view;

        $this->setDisplay(function ($model) {
            $this->data['model'] = $model;

            return view($this->getView(), $this->data);
        });

        return $this;
    }

    /**
     * @param  array  $data
     * @return $this
     */
    public function setData(array $data): View
    {
        $this->data = $data;

        return $this;
    }
}
