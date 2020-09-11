<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use Illuminate\Http\Request;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;
use SleepingOwl\Admin\Form\FormDefault;

class Range extends Number implements ColumnEditableInterface
{
    /**
     * @var string
     */
    protected $view = 'column.editable.range';

    /**
     * @var integer
     */
    protected $min = 0;

    /**
     * @var integer
     */
    protected $max = 100;

    /**
     * @var integer
     */
    protected $step = 1;

}
