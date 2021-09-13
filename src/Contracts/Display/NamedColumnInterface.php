<?php

namespace SleepingOwl\Admin\Contracts\Display;

interface NamedColumnInterface
{
    /**
     * @return string
     */
    public function getName();

    /**
     * @param  string  $name
     * @return $this
     */
    public function setName($name);

    /**
     * @return mixed
     */
    public function getSearchCallback();

    /**
     * @return mixed
     */
    public function getOrderCallback();

    /**
     * @return mixed
     */
    public function getFilterCallback();

    /**
     * @return mixed
     */
    public function getMetaData();
}
