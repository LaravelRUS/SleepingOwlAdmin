<?php

namespace SleepingOwl\Admin\Navigation;

use SleepingOwl\Admin\Navigation;
use Illuminate\Routing\UrlGenerator;
use SleepingOwl\Admin\Model\ModelConfiguration;

class Page extends Navigation
{

    /**
     * Menu item related model class
     * @var string
     */
    protected $model;

    /**
     * @var string
     */
    protected $title;

    /**
     * Menu item icon
     * @var string
     */
    protected $icon;

    /**
     * Menu item url
     * @var string
     */
    protected $url;

    /**
     * @var int
     */
    protected $priority = 100;

    /**
     * @var bool
     */
    protected $active = false;

    /**
     * @param string|null $modelClass
     */
    public function __construct($modelClass = null)
    {
        $this->setModel($modelClass);

        parent::__construct();
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

    /**
     * @return ModelConfiguration
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
    public function getTitle()
    {
        if (is_null($this->title) and $this->hasModel()) {
            return $this->getModelConfiguration()->getTitle();
        }

        return $this->title;
    }

    /**
     * @param string $title
     *
     * @return $this
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return string
     */
    public function getIcon()
    {
        return $this->icon;
    }

    /**
     * @param string $icon
     *
     * @return $this
     */
    public function setIcon($icon)
    {
        $this->icon = "<i class=\"{$icon}\"></i>";

        return $this;
    }

    /**
     * @return string
     */
    public function getUrl()
    {
        if (is_null($this->url) and $this->hasModel()) {
            return $this->getModelConfiguration()->getDisplayUrl();
        }

        if (strpos($this->url, '://') !== false) {
            return $this->url;
        }

        if (is_string($this->url)) {
            $this->url = url($this->url);
        }

        if ($this->url instanceof UrlGenerator) {
            return $this->url->full();
        }

        return $this->url;
    }

    /**
     * @param string $url
     *
     * @return $this
     */
    public function setUrl($url)
    {
        $this->url = $url;

        return $this;
    }

    /**
     * @return int
     */
    public function getPriority()
    {
        return $this->priority;
    }

    /**
     * @param int $priority
     *
     * @return $this
     */
    public function setPriority($priority)
    {
        $this->priority = $priority;

        return $this;
    }

    /**
     * @return boolean
     */
    public function isActive()
    {
        return $this->active;
    }

    /**
     * @return $this
     */
    public function setActive()
    {
        $this->active = true;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'pages'    => parent::toArray(),
            'hasChild' => $this->hasChild(),
            'title'    => $this->getTitle(),
            'icon'     => $this->getIcon(),
            'priority' => $this->getPriority(),
            'url'      => $this->getUrl(),
            'isActive' => $this->isActive()
        ];
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        return app('sleeping_owl.template')->view('_partials.navigation.page', $this->toArray());
    }
}