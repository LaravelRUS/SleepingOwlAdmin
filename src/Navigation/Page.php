<?php

namespace SleepingOwl\Admin\Navigation;

use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;

class Page extends \KodiComponents\Navigation\Page
{
    /**
     * Menu item related model class.
     * @var string
     */
    protected $model;

    /**
     * @param string|null $modelClass
     */
    public function __construct($modelClass = null)
    {
        parent::__construct();

        $this->setModel($modelClass);

        if ($this->hasModel()) {
            $this->setIcon($this->getModelConfiguration()->getIcon());
        }
    }

    /**
     * @return ModelConfigurationInterface
     */
    public function getModelConfiguration()
    {
        if (! $this->hasModel()) {
            return;
        }

        return app('sleeping_owl')->getModel($this->model);
    }

    /**
     * @return bool
     */
    public function hasModel()
    {
        return ! is_null($this->model) and class_exists($this->model);
    }

    /**
     * @return string
     */
    public function getId()
    {
        if (is_null($this->id) and $this->hasModel()) {
            return $this->model;
        }

        return parent::getId();
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        if (is_null($this->title) and $this->hasModel()) {
            return $this->getModelConfiguration()->getTitle();
        }

        return parent::getTitle();
    }

    /**
     * @return string
     */
    public function getUrl()
    {
        if (is_null($this->url) and $this->hasModel()) {
            return $this->getModelConfiguration()->getDisplayUrl();
        }

        return parent::getUrl();
    }

    /**
     * @return Closure
     */
    public function getAccessLogic()
    {
        if (! is_callable($this->accessLogic)) {
            if ($this->hasModel()) {
                return function () {
                    return $this->getModelConfiguration()->isDisplayable();
                };
            }
        }

        return parent::getAccessLogic();
    }

    /**
     * @param string|null $view
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function render($view = null)
    {
        $data = $this->toArray();

        if (! is_null($view)) {
            return view($view, $data)->render();
        }

        return app('sleeping_owl.template')->view('_partials.navigation.page', $data)->render();
    }

    /**
     * @param string $model
     *
     * @return $this
     */
    protected function setModel($model)
    {
        $this->model = $model;

        return $this;
    }
}
