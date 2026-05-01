<?php

namespace SleepingOwl\Admin\Navigation;

use Closure;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use SleepingOwl\Admin\Contracts\Navigation\BadgeInterface;
use SleepingOwl\Admin\Contracts\Navigation\NavigationInterface;
use SleepingOwl\Admin\Contracts\Navigation\PageInterface;

class NavigationBase implements NavigationInterface
{

    /**
     * @param array $data
     * @param string $class
     *
     * @return PageInterface
     */
    public static function makePage(array $data, $class = PageInterface::class)
    {
        $page = app($class);

        foreach ($data as $key => $value) {
            if ($key == 'badge') {
                if ($value instanceof BadgeInterface) {
                    $page->setBadge($value);
                    continue;
                } else if (!is_array($value)) {
                    $value = [$value];
                }

                call_user_func_array([$page, 'addBadge'], $value);
            } else if ($key != 'pages' and method_exists($page, $method = 'set'.ucfirst($key))) {
                $page->{$method}($value);
            }
        }

        if (isset($data['pages']) and is_array($data['pages'])) {
            foreach ($data['pages'] as $child) {
                $page->addPage($child);
            }
        }

        return $page;
    }

    /**
     * @var PageCollection|PageInterface[]
     */
    protected $items;

    /**
     * @var Closure
     */
    protected $accessLogic;

    /**
     * @var null|string
     */
    private $currentUrl;

    /**
     * @var PageInterface|null
     */
    private $currentPage;

    /**
     * Navigation constructor.
     *
     * @param array|null $pages
     */
    public function __construct(array $pages = null)
    {
        $this->items = new PageCollection();

        if (! is_null($pages)) {
            $this->setFromArray($pages);
        }
    }

    /**
     * @return null|string
     */
    public function getCurrentUrl()
    {
        if (is_null($this->currentUrl)) {
            return url()->current();
        }

        return $this->currentUrl;
    }

    /**
     * @param null|string $url
     *
     * @return $this
     */
    public function setCurrentUrl($url)
    {
        $this->currentUrl = $url;
        $this->currentPage = null;

        return $this;
    }

    /**
     * @param array $navigation
     */
    public function setFromArray(array $navigation)
    {
        foreach ($navigation as $page) {
            $this->addPage($page);
        }
    }

    /**
     * @param string|array|PageInterface $page
     *
     * @return PageInterface|null
     */
    public function addPage($page)
    {
        if (is_array($page)) {
            $page = static::makePage($page);
        } elseif (is_string($page) or is_null($page)) {
            $title = $page;

            $page = app(PageInterface::class);
            $page->setTitle($title);
        }

        if (! ($page instanceof PageInterface)) {
            return;
        }

        $this->getPages()->push($page);

        return $page;
    }

    /**
     * @return PageCollection|PageInterface[]
     */
    public function getPages()
    {
        return $this->items;
    }

    /**
     * @return int
     */
    public function countPages()
    {
        $count = 0;

        $this->getPages()->each(function (PageInterface $page) use (&$count) {
            $count++;
            $count += $page->countPages();
        });

        return $count;
    }

    /**
     * @param Closure $accessLogic
     *
     * @return $this
     */
    public function setAccessLogic(Closure $accessLogic)
    {
        $this->accessLogic = $accessLogic;

        foreach ($this->getPages() as $page) {
            $page->setAccessLogic($accessLogic);
        }

        return $this;
    }

    /**
     * @return Closure
     */
    public function getAccessLogic()
    {
        return is_callable($this->accessLogic)
            ? $this->accessLogic
            : true;
    }

    /**
     * @return $this
     */
    public function filterByAccessRights()
    {
        $this->items = $this->getPages()->filterByAccessRights();

        return $this;
    }

    /**
     * @return $this
     */
    public function filterEmptyPages()
    {
        $this->items = $this->getPages()->filterEmptyPages();

        return $this;
    }

    /**
     * @return $this
     */
    public function sort()
    {
        $this->items = $this->getPages()->sortByPriority();

        return $this;
    }

    /**
     * @return bool
     */
    public function hasChild()
    {
        return $this->getPages()->count() > 0;
    }

    /**
     * @return PageInterface|null
     */
    public function getCurrentPage()
    {
        $this->findActivePage();

        return $this->currentPage;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'pages' => $this->getPages()
        ];
    }

    /**
     * @param string|null $view
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function render($view = null)
    {
        $this->findActivePage();
        $this->filterByAccessRights();
        $this->filterEmptyPages();

        $this->sort();

        if (is_null($view)) {
            $view = config('navigation.view.navigation', 'navigation::navigation');
        }

        return view($view, $this->toArray())->render();
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

        $calculates = [];

        foreach ($foundPages as $data) {
            $calculates[] = $data[0];
        }

        if (count($calculates)) {
            $this->currentPage = Arr::get($foundPages, array_search(min($calculates), $calculates).'.1'); 
        }

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
     * @param string $url
     * @param array $foundPages
     */
    protected function findActive($url, array & $foundPages)
    {
        $this->getPages()->each(function (PageInterface $page) use ($url, &$foundPages) {

            if (strpos($url, $page->getUrl()) !== false) {
                $foundPages[] = [
                    levenshtein(substr($url, 0, 255), substr($page->getUrl(), 0, 255)),
                    $page,
                ];
            }

            $page->findActive($url, $foundPages);
        });
    }

    /**
     * @param string $url
     */
    protected function findActiveByAliases($url)
    {
        $this->getPages()->each(function (PageInterface $page) use ($url) {
            foreach ($page->getAliases() as $alias) {
                if (Str::is($alias, $url)) {
                    $page->setActive();
                    break;
                }
            }

            $page->findActiveByAliases($url);
        });
    }
}
