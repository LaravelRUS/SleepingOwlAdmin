<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static \SleepingOwl\Admin\Display\Column\Editable\Checkbox checkbox($name, $checkedLabel = null, $uncheckedLabel = null, $columnLabel = null)
 * @method static \SleepingOwl\Admin\Display\Column\Editable\Textarea textarea($name, $label = null)
 * @method static \SleepingOwl\Admin\Display\Column\Editable\Text text($name, $label = null)
 * @method static \SleepingOwl\Admin\Display\Column\Editable\Select select($name, $label = null, $options = [])
 * @method static \SleepingOwl\Admin\Display\Column\Editable\Datetime datetime($name, $label = null)
 */
class TableColumnEditable extends Facade
{
    public static function getFacadeAccessor()
    {
        return 'sleeping_owl.table.column.editable';
    }
}
