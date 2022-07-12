<?php

namespace SleepingOwl\Admin\Display\Column;

class TreeControl extends Control
{
    /**
     * @var bool
     */
    protected $orderable = false;

    /**
     * @var bool
     */
    protected bool $isSearchable = false;

    /**
     * Column view.
     *
     * @var string
     */
    protected string $view = 'column.tree_control';
}
