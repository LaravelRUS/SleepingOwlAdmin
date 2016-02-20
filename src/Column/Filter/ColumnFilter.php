<?php

namespace SleepingOwl\Admin\Column\Filter;

use SleepingOwl\Admin\AliasBinder;

/**
 * @method static \SleepingOwl\Admin\Column\Filter\Text text()
 * @method static \SleepingOwl\Admin\Column\Filter\Date date()
 * @method static \SleepingOwl\Admin\Column\Filter\Select select()
 * @method static \SleepingOwl\Admin\Column\Filter\Range range()
 */
class ColumnFilter extends AliasBinder
{
    /**
     * Column filter class aliases.
     * @var string[]
     */
    protected static $aliases = [];
}
