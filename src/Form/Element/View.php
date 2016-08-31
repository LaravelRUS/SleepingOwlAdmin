<?php

namespace SleepingOwl\Admin\Form\Element;

use Closure;
use Illuminate\Http\Request;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;

class View extends Custom
{
    /**
     * @var string
     */
    protected $view;

    /**
     * @var array
     */
    protected $data = [];

    /**
     * @param TemplateInterface $template
     * @param string $view
     * @param array $data
     * @param Closure $callback
     */
    public function __construct(TemplateInterface $template, $view, array $data = [], Closure $callback = null)
    {
        $this->setView($view);
        $this->setData($data);

        parent::__construct($template, $callback);
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
            $this->data['model'] = $model;

            return view($this->getView(), $this->data);
        });

        return $this;
    }

    /**
     * @param array $data
     *
     * @return $this
     */
    public function setData(array $data)
    {
        $this->data = $data;

        return $this;
    }

    /**
     * @param Request $request
     */
    public function save(Request $request)
    {
        $callback = $this->getCallback();
        if (is_callable($callback)) {
            call_user_func($callback, $this->getModel());
        }
    }
}
