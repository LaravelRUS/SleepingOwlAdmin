<?php

namespace SleepingOwl\Admin;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Navigation\Page;

class Navigation implements Renderable, Arrayable
{
    /**
     * @var Page
     */
    protected static $currentPage;

    /**
     * @var Collection
     */
    protected $items;

    public function __construct()
    {
        $this->items = new Collection();
    }

    /**
     * @param string|null $class
     *
     * @return Page
     */
    public function addPage($class = null)
    {
        $page = new Page($class);

        if (is_null(static::$currentPage)) {
            static::$currentPage = $this;
        }

        static::$currentPage->getItems()->push($page);

        return $page;
    }

    /**
     * @return Collection
     */
    public function getItems()
    {
        return $this->items;
    }

    /**
     * @param \Closure $callback
     *
     * @return $this
     */
    public function setItems(\Closure $callback)
    {
        $oldPage = static::$currentPage;
        static::$currentPage = $this;
        call_user_func($callback);
        static::$currentPage = $oldPage;

        return $this;
    }

    /**
     * @return bool
     */
    public function hasChild()
    {
        return $this->getItems()->count() > 0;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return $this->getItems();
    }

    protected function findActive()
    {
        $this->getItems()->each(function(Page $page) {
            if ($page->getUrl() == url()->current()) {
                $page->setActive();
            }
            $page->findActive();
        });
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        $this->items = $this->getItems()->sortBy(function ($page, $key) {
            return $page->getPriority();
        });

        $this->findActive();

        return app('sleeping_owl.template')->view('_partials.navigation.navigation', [
            'pages' => $this->toArray()
        ])->render();
    }
}