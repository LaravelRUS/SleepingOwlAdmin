<?php

namespace SleepingOwl\Admin\Contracts\Navigation;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Navigation\PageCollection;

interface NavigationInterface extends Renderable, Arrayable
{
    /**
     * @param  array  $navigation
     */
    public function setFromArray(array $navigation);

    /**
     * @return PageCollection
     */
    public function getPages();

    /**
     * @return int
     */
    public function countPages();

    /**
     * @return bool
     */
    public function hasChild();

    /**
     * @param  string|array|PageInterface  $page
     * @return PageInterface|null
     */
    public function addPage($page);

    /**
     * @return \Closure
     */
    public function getAccessLogic();

    /**
     * @param  \Closure  $accessLogic
     * @return $this
     */
    public function setAccessLogic(\Closure $accessLogic);

    /**
     * @return $this
     */
    public function filterByAccessRights();

    /**
     * @return $this
     */
    public function sort();

    /**
     * @return null|string
     */
    public function getCurrentUrl();

    /**
     * @return PageInterface|null
     */
    public function getCurrentPage();
}
