<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static \SleepingOwl\Admin\Display\Column\Filter\Text text()
 * @method static \SleepingOwl\Admin\Display\Column\Filter\Date date()
 * @method static \SleepingOwl\Admin\Display\Column\Filter\Select select()
 * @method static \SleepingOwl\Admin\Display\Column\Filter\Range range()
 */
class TableColumnFilter extends Facade
{
    /**
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'sleeping_owl.column_filter';
    }
}
