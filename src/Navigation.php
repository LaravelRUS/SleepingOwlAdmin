<?php

namespace SleepingOwl\Admin;

use Route;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\Navigation\PageInterface;
use SleepingOwl\Admin\Contracts\Navigation\NavigationInterface;

class Navigation extends \KodiComponents\Navigation\Navigation implements PageInterface
{
    protected $currentPage;
    protected $currentUrl;

    /**
     * Overload current page.
     * @return \KodiComponents\Navigation\Contracts\PageInterface|null
     */
    public function getCurrentPage()
    {
        $this->setAliasesId($this->getPages());
        $this->findActivePage();

        return $this->currentPage;
    }

    /**
     * Set Alias Id to Page.
     * @param Collection $pages
     */
    public function setAliasesId(Collection $pages)
    {
        $pages->each(function (PageInterface $page) {
            $page->setAliasId();

            if ($page->getPages()->count()) {
                $this->setAliasesId($page->getPages());
            }
        });
    }

    /**
     * @param string $url
     * @param array $foundPages
     */
    protected function findActive($url, array &$foundPages)
    {
        $this->findPageByAliasId($this->getPages(), $url);
    }

    /**
     * @param Collection $pages
     * @param $url
     */
    protected function findPageByAliasId(Collection $pages, $url)
    {
        $pages->each(function (PageInterface $page) use ($url) {
            $urlPath = parse_url($url, PHP_URL_PATH);

            if (Route::current()) {
                $parameters = collect(Route::current()->parameters());

                if ($parameters->has('adminModel')) {
                    $routeUrl = route('admin.model', [
                        'adminModel' => snake_case(class_basename($parameters->get('adminModel'))),
                    ]);

                    $urlPath = parse_url($routeUrl, PHP_URL_PATH);
                }
            }

            if ($urlPath) {
                if (md5($urlPath) == $page->getAliasId()) {
                    $this->currentPage = $page;

                    return;
                }
            }

            $this->findPageByAliasId($page->getPages(), $url);
        });
    }

    /**
     * @return bool
     */
    protected function findActivePage()
    {
        if (! is_null($this->currentPage)) {
            return true;
        }

        $foundPages = [];

        $url = $this->getCurrentUrl();

        $this->findActive($url, $foundPages);

        if (! is_null($this->currentPage)) {
            $this->currentPage->setActive();
        }

        if (config('navigation.aliases')) {
            $this->findActiveByAliases(
                ltrim(parse_url($url, PHP_URL_PATH), '/')
            );
        }

        return false;
    }

    /**
     * Переопределяем метод toArray(), вносим класс, treeview для активации меню tree в adminlte 2.4
     * @return array
     */
    public function toArray()
    {
        if ($this->isActive() and ! $this->hasClassProperty($class = config('navigation.class.active', 'active'))) {
            $this->setHtmlAttribute('class', $class);
        }
        if ($this->hasChild() and ! $this->hasClassProperty($class = config('navigation.class.has_child', 'treeview'))) {
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
}
