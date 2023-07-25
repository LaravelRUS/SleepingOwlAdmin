<?php

namespace SleepingOwl\Admin\Navigation;

use Closure;
use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Contracts\View\Factory;
use Illuminate\View\View;
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
     * Set Alias ID.
     */
    public function setAliasId()
    {
        if (! is_null($this->getUrl())) {
            $url = parse_url($this->getUrl(), PHP_URL_PATH);
            if ($url) {
                $this->aliasId = md5($url);
            }
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
     * @return ModelConfigurationInterface|void
     */
    public function getModelConfiguration()
    {
        if ($this->hasModel()) {
            return app('sleeping_owl')->getModel($this->model);
        }
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
     * @param  $target
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

        return $this->getParentUrl();
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
     * @param  string|null  $view
     * @return Factory|View
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

        if ($this->type == 'divider') {
            return app('sleeping_owl.template')->view('_partials.navigation.divider', $data)->render();
        }

        if ($this->type == 'label') {
            return app('sleeping_owl.template')->view('_partials.navigation.label', $data)->render();
        }

        if (! is_null($view)) {
            return app('sleeping_owl.template')->view($view, $data)->render();
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

    /**
     * Add divider.
     */
    public function addLabel()
    {
        $this->setId('label-'.$this->getPriority());
        $this->setType('label');
    }

    /**
     * Add divider.
     *
     * @return $this
     */
    public function addDivider()
    {
        $this->setId('divider-'.$this->getPriority());
        $this->setType('divider');

        return $this;
    }

    /**
     * Type navigation `divider` or `label`.
     *
     * @var string|null
     */
    protected $type = null;

    /**
     * @param  string  $type
     * @return $this
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /** FIX 8.1 */
    /**
     * @return string|null
     */
    public function getParentUrl(): ?string
    {
        if (is_null($this->url)) {
            return null;
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
}
