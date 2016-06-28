<?php

namespace SleepingOwl\Admin\Contracts;

interface SectionInterface extends Initializable
{

    /**
     * @return string
     */
    public function getTitle();

    /**
     * @return string
     */
    public function getAlias();
}
