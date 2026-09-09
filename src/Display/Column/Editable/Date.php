<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;
use SleepingOwl\Admin\Display\Column\Editable\Concerns\InteractsWithEditableColumn;
use SleepingOwl\Admin\Display\Column\Editable\Concerns\InteractsWithEditableDateTime;
use SleepingOwl\Admin\Form\Element\Date as FormDate;

class Date extends FormDate implements ColumnEditableInterface
{
    use InteractsWithEditableColumn, InteractsWithEditableDateTime {
        InteractsWithEditableDateTime::getModifierValue insteadof InteractsWithEditableColumn;
    }

    protected $view = 'column.editable.partials.editor';

    protected $editorType = 'date';

    public function __construct($name, $label = null, $small = null)
    {
        parent::__construct($name, $label);
        $this->initializeEditableColumn($label, $small);
        $this->setCombodateValue(['maxYear' => now()->addYears(100)->format('Y')]);
    }
}
