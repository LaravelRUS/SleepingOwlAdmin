<?php

namespace SleepingOwl\Admin\Navigation;

use Closure;
use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\Navigation\BadgeInterface;
use SleepingOwl\Admin\Contracts\Navigation\PageInterface;
use SleepingOwl\Admin\Support\HtmlAttributes;

class PageBase extends NavigationBase implements PageInterface
{
    use HtmlAttributes;

    /**
     * @var string
     */
    protected $id;

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
     * @var BadgeInterface[]|Collection
     */
    protected $badges;

    /**
     * @var int
     */
    protected $priority = 100;

    /**
     * @var bool
     */
    protected $active = false;

    /**
     * @var PageInterface
     */
    protected $parent;

    /**
     * @var array
     */
    protected $options = [];

    /**
     * @var array
     */
    protected $aliases = [];

    /**
     * Page constructor.
     *
     * @param string $title
     * @param string|null $url
     * @param string|null $id
     * @param int|null $priority
     * @param string|null $icon
     */
    public function __construct($title = null, $url = null, $id = null, $priority = 100, $icon = null)    
    {
        $this->items = new PageCollection();
        $this->badges = new Collection();

        $this->title = $title;

        if (! is_null($url)) {
            $this->setUrl($url);
        }

        if (! is_null($id)) {
            $this->setId($id);
        }

        if (! is_null($priority)) {
            $this->setPriority($priority);
        }

        if (! is_null($icon)) {
            $this->setIcon($icon);
        }
    }

    /**
     * @return array
     */
    public function getAliases()
    {
        return $this->aliases;
    }

    /**
     * @return array
     */
    public function hasAliases()
    {
        return count($this->aliases) > 0;
    }

    /**
     * @param string|array $aliases
     *
     * @return $this
     */
    public function addAlias($aliases)
    {
        if (! is_array($aliases)) {
            $aliases = func_get_args();
        }

        foreach ($aliases as $alias) {
            $this->aliases[] = $alias;
        }

        return $this;
    }

    /**
     * @param string|array|PageInterface|null $page
     *
     * @return PageInterface|null
     */
    public function addPage($page = null)
    {
        if ($page = parent::addPage($page)) {
            $page->setParent($this);
        }

        return $page;
    }

    /**
     * @param Closure $callback
     *
     * @return $this
     */
    public function setPages(Closure $callback)
    {
        call_user_func($callback, $this);

        return $this;
    }

    /**
     * @return string
     */
    public function getId()
    {
        if (is_null($this->id)) {
            return md5(implode('/', $this->getPath()));
        }

        return $this->id;
    }

    /**
     * @param string $id
     *
     * @return $this
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * @return string
     */
    public function getTitle()
    {
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
            $this->getTitle(),
        ];

        $page = $this;

        while (! is_null($page = $page->getParent())) {
            $data[] = $page->getTitle();
        }

        return array_reverse($data);
    }

    /**
     * @return array
     */
    public function getPathArray()
    {
        $data = [
            $this->toArray(),
        ];

        $page = $this;

        while (! is_null($page = $page->getParent())) {
            $data[] = $page->toArray();
        }

        return array_reverse($data);
    }

    /**
     * @return BadgeInterface[]|Collection
     */
    public function getBadges()
    {
        return $this->badges;
    }

    /**
     * @param BadgeInterface $badge
     *
     * @return $this
     */
    public function setBadge(BadgeInterface $badge)
    {
        $this->badges->push($badge);

        return $this;
    }

    /**
     * @param Closure|string $value
     * @param array $attributes
     *
     * @return $this
     */
    public function addBadge($value, array $attributes = null)
    {
        $this->setBadge(
            $badge = app(BadgeInterface::class)
        );

        $badge->setValue($value);

        if (is_array($attributes)) {
            $badge->setHtmlAttributes($attributes);
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
        $this->priority = (int) $priority;

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
     * @return PageInterface
     */
    public function getParent()
    {
        return $this->parent;
    }

    /**
     * @return int
     */
    public function getLevel()
    {
        return count($this->getPath()) - 1;
    }

    /**
     * @return bool
     */
    public function isChild()
    {
        return ! is_null($this->getParent());
    }

    /**
     * @param PageInterface $page
     *
     * @return bool
     */
    public function isChildOf(PageInterface $page)
    {
        return $this->isChild() and $this->getParent() === $page;
    }

    /**
     * @return Closure
     */
    public function getAccessLogic()
    {
        if (! is_callable($this->accessLogic)) {
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
            return $accessLogic($this);
        }

        return $accessLogic;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        if ($this->isActive() and ! $this->hasClassProperty($class = config('navigation.class.active', 'active'))) {
            $this->setHtmlAttribute('class', $class);
        }

        if ($this->hasChild() and ! $this->hasClassProperty($class = config('navigation.class.has_child', 'has-child'))) {
            $this->setHtmlAttribute('class', $class);
        }

        return parent::toArray() + [
                'hasChild' => $this->hasChild(),
                'id' => $this->getId(),
                'title' => $this->getTitle(),
                'icon' => $this->getIcon(),
                'priority' => $this->getPriority(),
                'url' => $this->getUrl(),
                'path' => $this->getPath(),
                'isActive' => $this->isActive(),
                'attributes' => $this->htmlAttributesToString(),
                'badges' => $this->getBadges()->sortBy(function (BadgeInterface $badge) {
                    return $badge->getPriority();
                }),
            ];
    }

    /**
     * @param string|null $view
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function render($view = null)
    {
        if (is_null($view)) {
            $view = config('navigation.view.page', 'navigation::page');
        }

        $data = $this->toArray();
        $data['pages'] = $this->getPages();

        return view($view, $data)->render();
    }

    /**
     * @param PageInterface $page
     */
    protected function setParent(PageInterface $page)
    {
        $this->parent = $page;
    }
}
