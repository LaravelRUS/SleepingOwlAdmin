<?php

namespace SleepingOwl\Admin\Contracts;

interface ColumnActionInterface
{
    /**
     * @return string
     */
    public function getName();

    /**
     * @param string $url
     *
     * @return $this
     */
    public function setUrl($url);
}
