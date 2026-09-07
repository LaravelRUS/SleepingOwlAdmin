<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use Illuminate\Http\Request;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;
use SleepingOwl\Admin\Display\Column\Editable\Concerns\InteractsWithEditableColumn;
use SleepingOwl\Admin\Form\Element\Select as FormSelect;

class Select extends FormSelect implements ColumnEditableInterface
{
    use InteractsWithEditableColumn;

    protected $view = 'column.editable.select';

    protected $relationKey;

    protected $optionList = [];

    public function __construct($name, $label = null, $options = [], $small = null)
    {
        parent::__construct($name, $label, $options);
        $this->initializeEditableColumn($label, $small);

        $this->setDisplay(function ($option) {
            return data_get($option, 'name') ?? data_get($option, 'title');
        });
    }

    public function getModifierValue()
    {
        if (is_callable($this->modifier)) {
            return call_user_func($this->modifier, $this);
        }

        return is_null($this->modifier)
            ? $this->getOptionName($this->getModelValue())
            : $this->modifier;
    }

    public function setRelationKey($relationKey)
    {
        $this->relationKey = $relationKey;

        return $this;
    }

    public function getRelationKey()
    {
        return $this->relationKey;
    }

    public function mutateOptions(): array
    {
        $this->optionList = $this->getOptions();

        return collect($this->optionList)
            ->map(fn ($text, $value) => ['value' => $value, 'text' => $text])
            ->values()
            ->all();
    }

    public function getOptionName($value)
    {
        if (! isset($value)) {
            return null;
        }

        return $this->optionList[$value] ?? $value;
    }

    public function toArray(): array
    {
        $options = $this->mutateOptions();
        if ($this->isNullable()) {
            array_unshift($options, [
                'value' => null,
                'text' => trans('sleeping_owl::lang.select.nothing'),
            ]);
        }

        return $this->editableColumnToArray() + [
            'options' => $options,
            'limit' => $this->getLimit(),
            'nullable' => $this->isNullable(),
            'select2Options' => $this->getSelect2Options(),
        ];
    }

    public function save(Request $request)
    {
        if (str_contains($this->getPath(), '.') && $this->getRelationKey()) {
            $this->setPath($this->getRelationKey());
            $this->setName($this->getRelationKey());
            $this->setModelAttributeKey($this->getRelationKey());
        }

        return $this->persistInlineFormValue(
            $request,
            fn (Request $mappedRequest) => parent::save($mappedRequest),
            fn (Request $mappedRequest) => parent::afterSave($mappedRequest)
        );
    }
}
