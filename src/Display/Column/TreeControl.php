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
    protected $isSearchable = false;

    /**
     * Column view.
     *
     * @var string
     */
    protected $view = 'column.tree_control';
}
