<?php

namespace SleepingOwl\Admin\Form\Element;

use Request;
use Illuminate\Database\Eloquent\Collection;

class MultiSelect extends Select
{
    /**
     * @return string
     */
    public function getName()
    {
        return $this->name.'[]';
    }

    /**
     * @return array
     */
    public function getValue()
    {
        $value = parent::getValue();

        if ($value instanceof Collection && $value->count() > 0) {
            $value = $value->pluck($value->first()->getKeyName())->all();
        }

        if ($value instanceof Collection) {
            $value = $value->toArray();
        }

        return $value;
    }

    public function save()
    {
    }

    public function afterSave()
    {
        $attribute = $this->getAttribute();

        if (is_null(Request::get($this->getPath()))) {
            $values = [];
        } else {
            $values = $this->getValue();
        }

        /** @var \Illuminate\Database\Eloquent\Relations\BelongsToMany $relation */
        $relation = $this->getModel()->{$attribute}();

        $relation->sync($values);
    }
}
