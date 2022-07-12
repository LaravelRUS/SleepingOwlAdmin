<?php

namespace SleepingOwl\Admin\Display\Column;

class TreeControl extends Control
{
    /**
     * @var string
     */
    protected string $view = 'column.tree_control';

    /**
     * @var bool
     */
    protected bool $orderable = false;

    /**
     * @var bool
     */
    protected bool $isSearchable = false;
}
