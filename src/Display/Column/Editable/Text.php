<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use Illuminate\Http\Request;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;
use SleepingOwl\Admin\Display\Column\Editable\Concerns\InteractsWithEditableColumn;
use SleepingOwl\Admin\Form\Element\Text as FormText;

class Text extends FormText implements ColumnEditableInterface
{
    use InteractsWithEditableColumn;

    protected $view = 'column.editable.partials.editor';

    protected $editorType = 'text';

    public function __construct($name, $label = null, $small = null)
    {
        parent::__construct($name, $label);
        $this->initializeEditableColumn($label, $small);
    }

    public function toArray(): array
    {
        return $this->editableColumnToArray();
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
