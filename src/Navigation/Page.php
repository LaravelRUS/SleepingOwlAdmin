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
     * @var ModelConfigurationInterface
     */
    protected $modelConfiguration;

    /**
     * @param ModelConfigurationInterface|null $modelConfiguration
     *
     * @internal param null|string $modelClass
     */
    public function __construct(ModelConfigurationInterface $modelConfiguration = null)
    {
        parent::__construct();

        if (! is_null($modelConfiguration)) {
            $this->modelConfiguration = $modelConfiguration;
            $this->setModel($this->modelConfiguration->getClass());
        }

        if ($this->hasModel()) {
            $this->setIcon($this->modelConfiguration->getIcon());
        }
    }

    /**
     * @return ModelConfigurationInterface
     */
    public function getModelConfiguration()
    {
        return $this->modelConfiguration;
    }

    /**
     * @return bool
     */
    public function hasModel()
    {
        return ! is_null($this->modelConfiguration) and ! is_null($this->model) and class_exists($this->model);
    }

    /**
     * @return string
     */
    public function getId()
    {
        if (is_null($this->id)) {
            return $this->getModelConfiguration()->getAlias();
        }

        return parent::getId();
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        if (is_null($this->title) and $this->hasModel()) {
            return $this->modelConfiguration->getTitle();
        }

        return parent::getTitle();
    }

    /**
     * @return string
     */
    public function getUrl()
    {
        if (is_null($this->url) and $this->hasModel()) {
            return $this->modelConfiguration->getDisplayUrl();
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
                    return $this->modelConfiguration->isDisplayable();
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
        $data['pages'] = $this->getPages();

        if (! is_null($view)) {
            return view($view, $data)->render();
        }

        return $this->modelConfiguration->getTemplate()->view('_partials.navigation.page', $data)->render();
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
