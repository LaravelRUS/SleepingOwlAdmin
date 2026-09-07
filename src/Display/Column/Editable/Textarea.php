<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use Illuminate\Http\Request;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;
use SleepingOwl\Admin\Display\Column\Editable\Concerns\InteractsWithEditableColumn;
use SleepingOwl\Admin\Form\Element\Textarea as FormTextarea;

class Textarea extends FormTextarea implements ColumnEditableInterface
{
    use InteractsWithEditableColumn;

    protected $view = 'column.editable.textarea';

    protected $maxRows = 0;

    public function __construct($name, $label = null, $small = null)
    {
        parent::__construct($name, $label);
        $this->initializeEditableColumn($label, $small);
    }

    public function toArray(): array
    {
        return $this->editableColumnToArray() + [
            'rows' => $this->getRows(),
            'maxRows' => $this->getMaxRows(),
            'isolated' => $this->getIsolated(),
        ];
    }

    public function setMaxRows(int $maxRows)
    {
        $this->maxRows = max(0, $maxRows);

        return $this;
    }

    public function getMaxRows(): int
    {
        return $this->maxRows;
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
