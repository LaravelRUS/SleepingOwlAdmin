<?php

namespace SleepingOwl\Admin\Contracts;

interface BreadcrumbsInterface
{
    /**
     * @param string $title
     * @param string $parent
     */
    public function register($title, $parent);

    /**
     * @return string
     */
    public function getParentBreadcrumb();
}
