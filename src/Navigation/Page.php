<?php

namespace SleepingOwl\Admin\Navigation;

use Closure;
use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Contracts\View\Factory;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Illuminate\View\View;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\Navigation\BadgeInterface;
use SleepingOwl\Admin\Contracts\Navigation\PageInterface;
use SleepingOwl\Admin\Support\HtmlAttributes;

class Page extends NavigationBase implements PageInterface
{
    use HtmlAttributes;

    /**
     * @var string
     */
    protected $id;

    /**
     * @var string|Closure
     */
    protected $title;

    /**
     * Menu item icon.
     *
     * @var string|Closure
     */
    protected $icon;

    /**
     * Menu item url.
     *
     * @var string|Closure|UrlGenerator|null
     */
    protected $url;

    /**
     * @var BadgeInterface[]|Collection
     */
    protected $badges;

    /**
     * @var int|Closure
     */
    protected $priority = 100;

    /**
     * @var bool|Closure
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
     * @var string|Closure
     */
    protected $target;

    /**
     * Type navigation `divider` or `label`.
     *
     * @var string|null
     */
    protected $type = null;

    /**
     * Page constructor.
     *
     * @param  string|Closure|null  $title
     * @param  string|Closure|null  $url
     * @param  string|null  $id
     * @param  int|Closure|null  $priority
     * @param  string|Closure|null  $icon
     */
    public function __construct($title = null, $url = null, ?string $id = null, $priority = 100, $icon = null)
    {
        parent::__construct();

        $this->badges = new Collection();

        if (is_string($title) && class_exists($title)) {
            $this->setModel($title);

            if ($this->hasModel()) {
                if ($this->getModelConfiguration()->getIcon()) {
                    $this->setIcon($this->getModelConfiguration()->getIcon());
                }
            }
        } else {
            $this->title = $title;
        }

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
     * @return bool
     */
    public function hasAliases()
    {
        return count($this->aliases) > 0;
    }

    /**
     * @param  string|array  $aliases
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
     * @param  string|array|PageInterface|null  $page
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
     * @param  Closure  $callback
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
            if ($this->hasModel()) {
                return $this->model;
            }

            return md5(implode('/', $this->getPath()));
        }

        return $this->id;
    }

    /**
     * @param  string  $id
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
        if (is_null($this->title) && $this->hasModel()) {
            return $this->getModelConfiguration()->getTitle();
        }

        if ($this->title instanceof Closure) {
            return call_user_func($this->title, $this);
        }

        return $this->title;
    }

    /**
     * @param  string|Closure  $title
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
        $icon = $this->icon;

        if ($icon instanceof Closure) {
            $icon = call_user_func($icon, $this);
        }

        if (is_null($icon) || empty($icon)) {
            return null;
        }

        if (strpos($icon, '<i') !== false) {
            return $icon;
        }

        return "<i class=\"{$icon}\"></i>";
    }

    /**
     * @param  string|Closure  $icon
     * @return $this
     */
    public function setIcon($icon)
    {
        $this->icon = $icon;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getUrl()
    {
        if (is_null($this->url) && $this->hasModel()) {
            return $this->getModelConfiguration()->getDisplayUrl();
        }

        if ($this->url instanceof Closure) {
            return $this->fixUrl(call_user_func($this->url, $this));
        }

        if ($this->url instanceof UrlGenerator) {
            return $this->fixUrl($this->url->full());
        }

        if (is_string($this->url)) {
            if (strpos($this->url, '://') !== false || strpos($this->url, '//') === 0) {
                return $this->fixUrl($this->url);
            }

            return $this->fixUrl(url($this->url));
        }

        return $this->url;
    }

    /**
     * @param  string|Closure  $url
     * @return $this
     */
    public function setUrl($url)
    {
        $this->url = $url;

        return $this;
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
     * @param  string|Closure  $target
     * @return $this
     */
    public function setTarget($target)
    {
        $this->target = $target;

        return $this;
    }

    /**
     * @return string
     */
    public function getTarget()
    {
        if ($this->target instanceof Closure) {
            return call_user_func($this->target, $this);
        }

        return $this->target;
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
     * @param  BadgeInterface  $badge
     * @return $this
     */
    public function setBadge(BadgeInterface $badge)
    {
        $this->badges->push($badge);

        return $this;
    }

    /**
     * @param Closure|string $value
     * @param array|null $attributes
     * @return $this
     */
    public function addBadge($value, ?array $attributes = null)
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
        $priority = $this->priority;

        if ($priority instanceof Closure) {
            $priority = call_user_func($priority, $this);
        }

        return (int) $priority;
    }

    /**
     * @param  int|Closure  $priority
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
        if ($this->active instanceof Closure) {
            return (bool) call_user_func($this->active, $this);
        }

        return $this->active;
    }

    /**
     * @param bool|Closure $active
     * @return $this
     */
    public function setIsActive($active)
    {
        $this->active = $active;

        return $this;
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
     * @param PageInterface $page
     */
    protected function setParent(PageInterface $page)
    {
        $this->parent = $page;
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
     * @param  PageInterface  $page
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
     * @return bool|Closure
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
     * @param  string|null  $view
     * @return Factory|View|string
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
     * @param  string  $type
     * @return $this
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @param  string  $url
     * @return string
     */
    protected function fixUrl($url)
    {
        if (is_null($url)) {
            return null;
        }

        if (Str::startsWith(config('app.url'), 'https://') && Str::startsWith($url, 'http://')) {
            return str_replace('http://', 'https://', $url);
        }

        return $url;
    }
}
