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
use SleepingOwl\Admin\Form\Element\MultiSelect;
use SleepingOwl\Admin\Form\FormDefault;

class Checklist extends Select implements ColumnEditableInterface
{
    protected $view = 'column.editable.checklist';

    protected $forceSaveRelation;

    public function getModifierValue()
    {
        return is_callable($this->modifier)
            ? call_user_func($this->modifier, $this)
            : $this->modifier;
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
        }

        return is_array($value) ? implode(',', $value) : $value;
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
