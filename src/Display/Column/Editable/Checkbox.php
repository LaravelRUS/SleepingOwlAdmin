<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use Illuminate\Http\Request;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;
use SleepingOwl\Admin\Display\Column\Editable\Concerns\InteractsWithEditableColumn;
use SleepingOwl\Admin\Form\Element\Checkbox as FormCheckbox;

class Checkbox extends FormCheckbox implements ColumnEditableInterface
{
    use InteractsWithEditableColumn;

    protected $view = 'column.editable.checkbox';

    protected $checkedLabel;

    protected $uncheckedLabel;

    public function __construct(
        $name,
        $columnLabel = null,
        $small = null,
        $uncheckedLabel = null,
        $checkedLabel = null
    ) {
        parent::__construct($name, $columnLabel);
        $this->initializeEditableColumn($columnLabel, $small);
        $this->setWidth('70px');

        $this->checkedLabel = $checkedLabel;
        $this->uncheckedLabel = $uncheckedLabel;

        if ($checkedLabel) {
            $this->setLabel($checkedLabel);
        }
    }

    public function getModifierValue()
    {
        if (is_callable($this->modifier)) {
            return call_user_func($this->modifier, $this);
        }

        return is_null($this->modifier)
            ? ($this->getModelValue() ? $this->getCheckedLabel() : $this->getUncheckedLabel())
            : $this->modifier;
    }

    public function getCheckedLabel()
    {
        return $this->checkedLabel ?? trans('sleeping_owl::lang.editable.checkbox.checked');
    }

    public function setCheckedLabel($label)
    {
        $this->checkedLabel = $label;

        return $this;
    }

    public function getUncheckedLabel()
    {
        return $this->uncheckedLabel ?? "<i class='fas fa-minus'></i>";
    }

    public function setUncheckedLabel($label)
    {
        $this->uncheckedLabel = $label;

        return $this;
    }

    public function toArray(): array
    {
        return $this->editableColumnToArray() + [
            'checkedLabel' => $this->getCheckedLabel(),
            'uncheckedLabel' => $this->getUncheckedLabel(),
            'text' => $this->getModifierValue(),
        ];
    }

    public function save(Request $request)
    {
        return $this->persistInlineFormValue(
            $request,
            fn (Request $mappedRequest) => parent::save($mappedRequest),
            fn (Request $mappedRequest) => parent::afterSave($mappedRequest)
        );
    }
}
