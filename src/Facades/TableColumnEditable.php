<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static \SleepingOwl\Admin\Display\Column\Editable\Checkbox checkbox($name)
 */
class TableColumnEditable extends Facade
{
    public static function getFacadeAccessor()
    {
        return 'sleeping_owl.table.column.editable';
    }
}
