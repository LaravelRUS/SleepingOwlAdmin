<?php

namespace SleepingOwl\Admin\Navigation;

use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\Navigation\PageInterface;

class PageCollection extends Collection
{

    /**
     * The items contained in the collection.
     *
     * @var array|PageInterface[]
     */
    protected $items = [];

    /**
     * @param string $id
     *
     * @return PageInterface|null
     */
    public function findById($id)
    {
        foreach ($this->items as $page) {
            if ($page->getId() == $id) {
                return $page;
            } else if ($found = $page->getPages()->findById($id)) {
                return $found;
            }
        }
    }

    /**
     * @param string $path
     * @param string $separator
     *
     * @return PageInterface|null
     */
    public function findByPath($path, $separator = '/')
    {
        foreach ($this->items as $page) {
            if (implode($separator, $page->getPath()) == $path) {
                return $page;
            } else if ($found = $page->getPages()->findByPath($path, $separator)) {
                return $found;
            }
        }
    }

    /**
     * @return static
     */
    public function filterByAccessRights()
    {
        return $this->filter(function (PageInterface $page) {
            $page->filterByAccessRights();

            return $page->checkAccess();
        });
    }

    /**
     * @return static
     */
    public function filterEmptyPages()
    {
        return $this->filter(function(PageInterface $page) {
            $page->filterEmptyPages();
            return !(is_null($page->getUrl()) and ! $page->hasChild());
        });
    }

    /**
     * @return $this
     */
    public function sortByPriority()
    {
        return $this->sortBy(function (PageInterface $page) {
            return $page->getPriority();
        })->each(function (PageInterface $page) {
            $page->sort();
        });
    }

    /**
     * @param PageInterface $page
     * @param string|null $key
     *
     * @return $this
     */
    public function prepend($page, $key = null)
    {
        if (! ($page instanceof PageInterface)) {
            throw new \InvalidArgumentException('$page must be instance of PageInterface');
        }

        return parent::prepend($page, $page->getId());
    }

    /**
     * @param  mixed  $pages [optional]
     * @param PageInterface $page
     *
     * @return $this
     */
    public function push(...$pages)
    {

        foreach ($pages as $page) {
            if (! ($page instanceof PageInterface)) {
                throw new \InvalidArgumentException('$page must be instance of PageInterface');
            }

            $this->offsetSet($page->getId(), $page);
        }

        return $this;
    }
}
