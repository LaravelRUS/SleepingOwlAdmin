<?php

namespace SleepingOwl\Admin\Contracts\Navigation;

use Closure;

interface PageInterface extends NavigationInterface
{

    /**
     * @return string
     */
    public function getId();

    /**
     * @return string
     */
    public function getTitle();

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
     * @return $this
     */
    public function setActive();

    /**
     * @return PageInterface
     */
    public function getParent();

    /**
     * @return array
     */
    public function getPath();

    /**
     * @return array
     */
    public function getPathArray();

    /**
     * @return bool
     */
    public function checkAccess();

    /**
     * @param Closure $callback
     *
     * @return $this
     */
    public function setPages(Closure $callback);

    /**
     * @return bool
     */
    public function isChild();

    /**
     * @param PageInterface $page
     *
     * @return bool
     */
    public function isChildOf(PageInterface $page);

    /**
     * @return int
     */
    public function getLevel();

    /**
     * @return array
     */
    public function getAliases();

    /**
     * @return bool
     */
    public function hasAliases();

    /**
     * @param string|array $aliases
     *
     * @return $this
     */
    public function addAlias($aliases);
}
