<?php

namespace SleepingOwl\Admin\Contracts\Display;

interface NamedColumnInterface
{
    /**
     * @return string
     */
    public function getName();

    /**
     * @param string $name
     *
     * @return $this
     */
    public function setName($name);
}
