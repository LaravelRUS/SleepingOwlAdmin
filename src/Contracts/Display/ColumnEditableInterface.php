<?php

namespace SleepingOwl\Admin\Contracts\Display;

use SleepingOwl\Admin\Contracts\ColumnInterface;

interface ColumnEditableInterface extends ColumnInterface
{
    /**
     * Save form item.
     *
     * @param mixed $value
     */
    public function save($value);
}
