<?php

namespace SleepingOwl\Admin\Navigation;

use SleepingOwl\Admin\Navigation;
use Illuminate\Routing\UrlGenerator;
use SleepingOwl\Admin\Traits\HtmlAttributes;
use SleepingOwl\Admin\Model\ModelConfiguration;
use SleepingOwl\Admin\Contracts\Navigation\PageInterface;
use SleepingOwl\Admin\Contracts\Navigation\BadgeInterface;

class Page extends Navigation implements PageInterface
{
    use HtmlAttributes;

    /**
     * Menu item related model class.
     * @var string
     */
    protected $model;

    /**
     * @var string
     */
    protected $title;

    /**
     * Menu item icon.
     * @var string
     */
    protected $icon;

    /**
     * Menu item url.
     * @var string
     */
    protected $url;

    /**
     * @var Badge
     */
    protected $badge;

    /**
     * @var int
     */
    protected $priority = 100;

    /**
     * @var bool
     */
    protected $active = false;

    /**
     * @var Page
     */
    protected $parent;

    /**
     * @param string|null $modelClass
     */
    public function __construct($modelClass = null)
    {
        $this->setModel($modelClass);

        parent::__construct();
    }

    /**
     * @param string|array|PageInterface|null $page
     *
     * @return Page
     */
    public function addPage($page = null)
    {
        $page = parent::addPage($page);
        $page->setParent($this);

        return $page;
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
     * @return array
     */
    public function getPath()
    {
        $data = [
            $this->toArray(),
        ];

        $page = $this;

        while (! is_null($page = $page->getParent())) {
            $data[] = $page->toArray();
        }

        return $data;
    }

    /**
     * @return Badge
     */
    public function getBadge()
    {
        return $this->badge;
    }

    /**
     * @param BadgeInterface $badge
     *
     * @return $this
     */
    public function setBadge(BadgeInterface $badge)
    {
        $this->badge = $badge;

        return $this;
    }

    /**
     * @param string   $value
     * @param \Closure $closure
     *
     * @return $this
     */
    public function addBadge($value, \Closure $closure = null)
    {
        $this->badge = app()->make(BadgeInterface::class, [$value]);

        if (is_callable($closure)) {
            call_user_func($closure, $this->badge);
        }

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
     * @return bool
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

        if (! is_null($this->getParent())) {
            $this->getParent()->setActive();
        }

        return $this;
    }

    /**
     * @param string $title
     *
     * @return Page|false
     */
    public function findPageByTitle($title)
    {
        if ($this->getTitle() == $title) {
            return $this;
        }

        return parent::findPageByTitle($title);
    }

    /**
     * @param PageInterface $page
     *
     * @return $this
     */
    public function setParent(PageInterface $page)
    {
        $this->parent = $page;

        return $this;
    }

    /**
     * @return PageInterface
     */
    public function getParent()
    {
        return $this->parent;
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

            if (! is_null($parent = $this->getParent())) {
                return $parent->getAccessLogic();
            }
        }

        return parent::getAccessLogic();
    }

    /**
     * @return bool
     */
    public function checkAccess()
    {
        $accessLogic = $this->getAccessLogic();

        if (is_callable($accessLogic)) {
            return call_user_func($accessLogic, $this);
        }

        return $accessLogic;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        if ($this->isActive()) {
            $this->setAttribute('class', 'active');
        }

        if ($this->hasChild()) {
            $this->setAttribute('class', 'treeview');
        }

        return [
            'pages'      => parent::toArray(),
            'hasChild'   => $this->hasChild(),
            'title'      => $this->getTitle(),
            'icon'       => $this->getIcon(),
            'priority'   => $this->getPriority(),
            'url'        => $this->getUrl(),
            'isActive'   => $this->isActive(),
            'attributes' => $this->getAttributes(),
            'badge'      => $this->getBadge(),
        ];
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        return app('sleeping_owl.template')->view('_partials.navigation.page', $this->toArray());
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

    protected function findActive()
    {
        $url = url()->current();

        $this->getPages()->each(function (PageInterface $page) use ($url) {
            if (strpos($url, $page->getUrl()) !== false) {
                Navigation::$foundPages[] = [
                    levenshtein($url, $page->getUrl()),
                    $page,
                ];
            }

            $page->findActive();
        });
    }
}
