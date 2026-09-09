<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;

class Range extends Number implements ColumnEditableInterface
{
    /**
     * @var string
     */
    protected $view = 'column.editable.partials.editor';

    protected $editorType = 'range';

    /**
     * @var int
     */
    protected $min = 0;

    /**
     * @var int
     */
    protected $max = 100;

    /**
     * @var int
     */
    protected $step = 1;
}
