<?php

namespace SleepingOwl\Admin\Contracts\Form\Columns;

use SleepingOwl\Admin\Contracts\Form\ElementsInterface;

interface ColumnInterface extends ElementsInterface
{
    /**
     * @return int
     */
    public function getWidth();

    /**
     * @return string
     */
    public function getSize();

    /**
     * @param  string  $size
     * @return $this
     */
    public function setSize($size);
}
