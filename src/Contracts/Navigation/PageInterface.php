<?php

namespace SleepingOwl\Admin\Contracts\Navigation;

use SleepingOwl\Admin\Navigation\Page;

interface PageInterface extends NavigationInterface
{
    /**
     * @param  string|array|PageInterface|null  $page
     * @return Page
     */
    public function addPage($page = null);

    /**
     * @return mixed
     */
    public function getAliasId();

    /**
     * @return string
     */
    public function getTitle();

    /**
     * @return mixed
     */
    public function setAliasId();

    /**
     * @return string
     */
    public function getIcon();

    /**
     * @return string
     */
    public function getUrl();

    /**
     * @return int
     */
    public function getPriority();

    /**
     * @return bool
     */
    public function isActive();

    /**
     * @return PageInterface
     */
    public function getParent();

    /**
     * @return \Closure
     */
    public function getAccessLogic();

    /**
     * @return bool
     */
    public function checkAccess();
}
