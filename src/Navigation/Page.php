<?php

namespace SleepingOwl\Admin\Navigation;

use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\Navigation\PageInterface;

class Page extends \KodiComponents\Navigation\Page implements PageInterface
{
    /**
     * Menu item related model class.
     *
     * @var string
     */
    protected $model;

    /**
     * Menu item by url id.
     *
     * @var string
     */
    protected $aliasId;

    /**
     * Menu item target attribute.
     *
     * @var string
     */
    protected $target;

    /**
     * @param  string|null  $modelClass
     */
    public function __construct($modelClass = null)
    {
        parent::__construct();

        $this->setModel($modelClass);

        if ($this->hasModel()) {
            if ($this->getModelConfiguration()->getIcon()) {
                $this->setIcon($this->getModelConfiguration()->getIcon());
            }
        }
    }

    /**
     * Set Alias Id.
     */
    public function setAliasId()
    {
        $url = parse_url($this->getUrl(), PHP_URL_PATH);
        if ($url) {
            $this->aliasId = md5($url);
        }
    }

    /**
     * @return string
     */
    public function getAliasId()
    {
        return $this->aliasId;
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
        return ! is_null($this->model) && class_exists($this->model);
    }

    /**
     * @return string
     */
    public function getId()
    {
        if (is_null($this->id) && $this->hasModel()) {
            return $this->model;
        }

        return parent::getId();
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        if (is_null($this->title) && $this->hasModel()) {
            return $this->getModelConfiguration()->getTitle();
        }

        return parent::getTitle();
    }

    /**
     * Set Target.
     *
     * @param $target
     */
    public function setTarget($target)
    {
        $this->target = $target;
    }

    /**
     * @return string
     */
    public function getTarget()
    {
        return $this->target;
    }

    /**
     * @return string
     */
    public function getUrl()
    {
        if (is_null($this->url) && $this->hasModel()) {
            return $this->getModelConfiguration()->getDisplayUrl();
        }

        return parent::getUrl();
    }

    /**
     * @return \Closure
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
     * @param  string|null  $view
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function render($view = null)
    {
        if ($this->hasChild() && ! $this->hasClassProperty($class = config('navigation.class.has_child', 'treeview'))) {
            $this->setHtmlAttribute('class', $class);
        }

        if ($this->getTarget()) {
            $this->setHtmlAttribute('target', $this->getTarget());
        }

        $data = $this->toArray();

        if (! is_null($view)) {
            return view($view, $data)->render();
        }

        return app('sleeping_owl.template')->view('_partials.navigation.page', $data)->render();
    }

    /**
     * @param  string  $model
     * @return $this
     */
    protected function setModel($model)
    {
        $this->model = $model;

        return $this;
    }
}
