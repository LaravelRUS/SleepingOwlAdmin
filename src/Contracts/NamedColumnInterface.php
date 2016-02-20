<?php

namespace SleepingOwl\Admin\Contracts;

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
