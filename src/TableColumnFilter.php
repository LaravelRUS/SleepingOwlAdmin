<?php

namespace SleepingOwl\Admin;

use SleepingOwl\Admin\AliasBinder;

/**
 * @method static \SleepingOwl\Admin\Display\Column\Filter\Text text()
 * @method static \SleepingOwl\Admin\Display\Column\Filter\Date date()
 * @method static \SleepingOwl\Admin\Display\Column\Filter\Select select()
 * @method static \SleepingOwl\Admin\Display\Column\Filter\Range range()
 */
class TableColumnFilter extends AliasBinder
{
    /**
     * Column filter class aliases.
     * @var string[]
     */
    protected static $aliases = [];
}
