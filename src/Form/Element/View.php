<?php

namespace SleepingOwl\Admin\Form\Element;

use Closure;
use KodiCMS\Assets\Contracts\MetaInterface;
use KodiCMS\Assets\Contracts\PackageManagerInterface;
use SleepingOwl\Admin\Contracts\TemplateInterface;

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
     * @param string $view
     * @param array $data
     * @param Closure $callback
     * @param PackageManagerInterface $packageManager
     * @param MetaInterface $meta
     * @param TemplateInterface $template
     */
    public function __construct($view,
                                array $data = [],
                                Closure $callback = null,
                                PackageManagerInterface $packageManager,
                                MetaInterface $meta,
                                TemplateInterface $template)
    {
        $this->setView($view);
        $this->setData($data);

        parent::__construct($callback, $packageManager, $meta, $template);
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

    public function save()
    {
        $callback = $this->getCallback();
        if (is_callable($callback)) {
            call_user_func($callback, $this->getModel());
        }
    }
}
