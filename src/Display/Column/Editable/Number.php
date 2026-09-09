<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use Illuminate\Http\Request;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;
use SleepingOwl\Admin\Display\Column\Editable\Concerns\InteractsWithEditableColumn;
use SleepingOwl\Admin\Form\Element\Number as FormNumber;

class Number extends FormNumber implements ColumnEditableInterface
{
    use InteractsWithEditableColumn;

    protected $view = 'column.editable.partials.editor';

    protected $editorType = 'number';

    public function __construct($name, $label = null, $small = null)
    {
        parent::__construct($name, $label);
        $this->initializeEditableColumn($label, $small);
    }

    public function toArray(): array
    {
        return $this->editableColumnToArray() + [
            'min' => $this->getMin(),
            'max' => $this->getMax(),
            'step' => $this->getStep(),
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
