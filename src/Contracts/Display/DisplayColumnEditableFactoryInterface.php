<?php

namespace SleepingOwl\Admin\Contracts\Display;

use SleepingOwl\Admin\Display\Column\Editable;

/**
 * @method Editable\Boolean boolean($name, $columnLabel = null, $small = null, $uncheckedLabel = null, $checkedLabel = null)
 * @method Editable\Checkbox checkbox($name, $columnLabel = null, $small = null, $uncheckedLabel = null, $checkedLabel = null)
 * @method Editable\Checklist checklist($name, $label = null, $options = [], $small = null)
 * @method Editable\Date date($name, $label = null, $small = null)
 * @method Editable\DateTime datetime($name, $label = null, $small = null)
 * @method Editable\Number number($name, $label = null, $small = null)
 * @method Editable\Range range($name, $label = null, $small = null)
 * @method Editable\Select select($name, $label = null, $options = [], $small = null)
 * @method Editable\Text text($name, $label = null, $small = null)
 * @method Editable\Textarea textarea($name, $label = null, $small = null)
 */
interface DisplayColumnEditableFactoryInterface
{
}
