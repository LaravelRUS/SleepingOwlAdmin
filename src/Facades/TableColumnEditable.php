<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static \SleepingOwl\Admin\Display\Column\Editable\Checkbox checkbox($name, $columnLabel = null, $small = null, $uncheckedLabel = null, $checkedLabel = null)
 * @method static \SleepingOwl\Admin\Display\Column\Editable\Checklist checklist($name, $label = null, $options = [], $small = null)
 * @method static \SleepingOwl\Admin\Display\Column\Editable\Date date($name, $label = null, $small = null)
 * @method static \SleepingOwl\Admin\Display\Column\Editable\Datetime datetime($name, $label = null, $small = null)
 * @method static \SleepingOwl\Admin\Display\Column\Editable\Number number($name, $label = null, $small = null)
 * @method static \SleepingOwl\Admin\Display\Column\Editable\Range range($name, $label = null, $small = null)
 * @method static \SleepingOwl\Admin\Display\Column\Editable\Select select($name, $label = null, $options = [], $small = null)
 * @method static \SleepingOwl\Admin\Display\Column\Editable\Text text($name, $label = null, $small = null)
 * @method static \SleepingOwl\Admin\Display\Column\Editable\Textarea textarea($name, $label = null, $small = null)
 */
class TableColumnEditable extends Facade
{
    public static function getFacadeAccessor()
    {
        return 'sleeping_owl.table.column.editable';
    }
}
