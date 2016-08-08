<?php

namespace SleepingOwl\Admin\Contracts;

use Closure;
use KodiComponents\Navigation\Contracts\PageInterface;
use KodiComponents\Navigation\PageCollection;

interface NavigationInterface
{
    /**
     * @param array $data
     * @param string $class
     *
     * @return PageInterface
     */
    public static function makePage(array $data, $class = PageInterface::class);

    /**
     * @return null|string
     */
    public function getCurrentUrl();

    /**
     * @param null|string $url
     *
     * @return $this
     */
    public function setCurrentUrl($url);

    /**
     * @param array $navigation
     */
    public function setFromArray(array $navigation);

    /**
     * @param string|array|PageInterface $page
     *
     * @return PageInterface|null
     */
    public function addPage($page);

    /**
     * @return $this
     */
    public function filterByAccessRights();

    /**
     * @return PageInterface|null
     */
    public function getCurrentPage();

    /**
     * @param string|null $view
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function render($view = null);

    /**
     * @return PageCollection|PageInterface[]
     */
    public function getPages();

    /**
     * @return int
     */
    public function countPages();

    /**
     * @param Closure $accessLogic
     *
     * @return $this
     */
    public function setAccessLogic(Closure $accessLogic);

    /**
     * @return Closure
     */
    public function getAccessLogic();

    /**
     * @return $this
     */
    public function filterEmptyPages();

    /**
     * @return $this
     */
    public function sort();

    /**
     * @return bool
     */
    public function hasChild();

    /**
     * @return array
     */
    public function toArray();
}
