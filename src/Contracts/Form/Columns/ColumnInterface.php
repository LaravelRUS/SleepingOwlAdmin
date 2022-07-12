<?php

namespace SleepingOwl\Admin\Contracts\Form\Columns;

use SleepingOwl\Admin\Contracts\Form\ElementsInterface;

interface ColumnInterface extends ElementsInterface
{
    /**
     * @return string|null
     */
    public function getWidth(): ?string;

    /**
     * @return null|string
     */
    public function getSize(): ?string;

    /**
     * @param string $size
     * @return $this
     */
    public function setSize(string $size): ColumnInterface;
}
