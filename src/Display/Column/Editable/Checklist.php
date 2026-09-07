<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use Exception;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;
use SleepingOwl\Admin\Display\Column\Concerns\HasListDisplayLimit;
use SleepingOwl\Admin\Form\Element\MultiSelect;
use SleepingOwl\Admin\Form\FormDefault;

class Checklist extends Select implements ColumnEditableInterface
{
    use HasListDisplayLimit;

    protected $view = 'column.editable.checklist';

    protected $forceSaveRelation;

    public function getModifierValue()
    {
        return is_callable($this->modifier)
            ? call_user_func($this->modifier, $this)
            : $this->modifier;
    }

    public function setOptions($options): self
    {
        if (is_array($options) && $options !== [] && array_is_list($options)) {
            $options = array_combine($options, $options);
        }

        return parent::setOptions($options);
    }

    public function getModelValue()
    {
        $value = parent::getModelValue();

        if ($value instanceof EloquentCollection) {
            if ($value->isEmpty()) {
                $value = [];
            } else {
                try {
                    $value = $value->pluck($value->first()->getKeyName())->all();
                } catch (Exception $exception) {
                    $value = [];
                }
            }
        } elseif ($value instanceof Collection) {
            $value = $value->all();
        } elseif (is_string($value)) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $value = $decoded;
            }
        }

        return is_array($value) ? implode(',', $value) : $value;
    }

    public function toArray(): array
    {
        $data = parent::toArray();

        return $data + [
            'values' => $this->getSelectedOptionNames(),
            'maxLists' => $this->getMaxLists() ?: $this->getLimit(),
        ];
    }

    protected function getSelectedOptionNames(): array
    {
        return collect(explode(',', (string) $this->getModelValue()))
            ->map(fn ($value) => trim($value))
            ->filter(fn ($value) => $value !== '')
            ->map(fn ($value) => $this->optionList[$value] ?? null)
            ->filter(fn ($value) => ! is_null($value))
            ->values()
            ->all();
    }

    public function prepareValue($value)
    {
        $storesArray = $this->storesChecklistAsArray();

        if ($value === '' || $value === null || $value === []) {
            if ($this->isNullable()) {
                return null;
            }

            return $storesArray ? [] : '';
        }

        if (is_array($value) && ! $storesArray) {
            return implode(',', $value);
        }

        return parent::prepareValue($value);
    }

    protected function storesChecklistAsArray(): bool
    {
        $model = $this->getModel();
        if (! $model) {
            return false;
        }

        $attribute = $this->getModelAttributeKey();
        if ($model->hasCast($attribute, [
            'array',
            'json',
            'json:unicode',
            'object',
            'collection',
            'encrypted:array',
            'encrypted:collection',
            'encrypted:json',
            'encrypted:object',
        ])) {
            return true;
        }

        $currentValue = $model->getAttribute($attribute);

        return is_array($currentValue) || $currentValue instanceof Collection;
    }

    public function save(Request $request)
    {
        if (! $this->getForceSaveRelation()) {
            return parent::save($request);
        }

        $model = $this->getModel();
        $relationName = $this->getModelAttributeKey();
        if (! method_exists($model, $relationName)) {
            return parent::save($request);
        }

        $relation = $model->{$relationName}();
        if (! $relation instanceof BelongsToMany && ! $relation instanceof HasMany) {
            return parent::save($request);
        }

        $element = new MultiSelect($this->getPath());
        $element->setModelForOptions(get_class($relation->getModel()));

        $input = [];
        Arr::set($input, $this->getPath(), $request->input('value', $this->getDefaultValue()));
        $request->merge($input);

        $form = new FormDefault([$element]);
        $form->setModelClass(get_class($model));
        $form->initialize();
        $form->setId($model->getKey());
        $form->saveForm($request);

        return $request->input('value', $this->getDefaultValue());
    }

    public function getForceSaveRelation()
    {
        return $this->forceSaveRelation;
    }

    public function setForceSaveRelation($forceSaveRelation = true)
    {
        $this->forceSaveRelation = $forceSaveRelation;

        return $this;
    }
}
