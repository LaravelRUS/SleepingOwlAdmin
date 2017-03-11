<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

class MultiSelect extends Select
{
    /**
     * @var bool
     */
    protected $taggable = false;

    /**
     * @var bool
     */
    protected $deleteRelatedItem = false;

    /**
     * @var string
     */
    protected $view = 'form.element.select';

    /**
     * @return string
     */
    public function getName()
    {
        return parent::getName().'[]';
    }

    /**
     * @return array
     */
    public function getValueFromModel()
    {
        $value = parent::getValueFromModel();
        if ($value instanceof Collection && $value->count() > 0) {
            $value = $value->pluck($value->first()->getKeyName())->all();
        }

        if ($value instanceof Collection) {
            $value = $value->toArray();
        }

        return $value;
    }

    /**
     * @return bool
     */
    public function isTaggable()
    {
        return $this->taggable;
    }

    /**
     * @return $this
     */
    public function taggable()
    {
        $this->taggable = true;

        return $this;
    }

    /**
     * @return bool
     */
    public function isDeleteRelatedItem()
    {
        return $this->deleteRelatedItem;
    }

    /**
     * @return $this
     */
    public function deleteRelatedItem()
    {
        $this->deleteRelatedItem = true;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $attributes = [
            'id' => $this->getName(),
            'class' => 'form-control input-select',
            'multiple',
        ];

        if ($this->isTaggable()) {
            $attributes['class'] .= ' input-taggable';
        }

        if ($this->isReadonly()) {
            $attributes['disabled'] = 'disabled';
        }

        return [
            'tagable' => $this->isTaggable(),
            'attributes' => $attributes,
        ] + parent::toArray();
    }

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function save(\Illuminate\Http\Request $request)
    {
        if (is_null($this->getModelForOptions())) {
            parent::save($request);
        }
    }

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function afterSave(\Illuminate\Http\Request $request)
    {
        if (is_null($this->getModelForOptions())) {
            return;
        }

        $attribute = $this->getModelAttributeKey();

        if (is_null($request->input($this->getPath()))) {
            $values = [];
        } else {
            $values = $this->getValueFromModel();
        }

        $relation = $this->getModel()->{$attribute}();

        if ($relation instanceof \Illuminate\Database\Eloquent\Relations\BelongsToMany) {
            $this->syncBelongsToManyRelation($relation, $values);
        } elseif ($relation instanceof \Illuminate\Database\Eloquent\Relations\HasMany) {
            $this->deleteOldItemsFromHasManyRelation($relation, $values);
            $this->attachItemsToHasManyRelation($relation, $values);
        }
    }

    /**
     * @param \Illuminate\Database\Eloquent\Relations\BelongsToMany $relation
     * @param array $values
     *
     * @return void
     */
    protected function syncBelongsToManyRelation(\Illuminate\Database\Eloquent\Relations\BelongsToMany $relation, array $values)
    {
        foreach ($values as $i => $value) {
            if (! array_key_exists($value, $this->getOptions()) and $this->isTaggable()) {
                $model = clone $this->getModelForOptions();
                $model->{$this->getDisplay()} = $value;
                $model->save();

                $values[$i] = $model->getKey();
            }
        }

        $relation->sync($values);
    }

    /**
     * @param \Illuminate\Database\Eloquent\Relations\HasMany $relation
     * @param array $values
     */
    protected function deleteOldItemsFromHasManyRelation(\Illuminate\Database\Eloquent\Relations\HasMany $relation, array $values)
    {
        $items = $relation->get();

        foreach ($items as $item) {
            if (! in_array($item->getKey(), $values)) {
                if ($this->isDeleteRelatedItem()) {
                    $item->delete();
                } else {
                    $item->{$relation->getPlainForeignKey()} = null;
                    $item->save();
                }
            }
        }
    }

    /**
     * @param \Illuminate\Database\Eloquent\Relations\HasMany $relation
     * @param array $values
     */
    protected function attachItemsToHasManyRelation(\Illuminate\Database\Eloquent\Relations\HasMany $relation, array $values)
    {
        foreach ($values as $i => $value) {
            /** @var Model $model */
            $model = clone $this->getModelForOptions();
            $item = $model->find($value);

            if (is_null($item)) {
                if (! $this->isTaggable()) {
                    continue;
                }

                $model->{$this->getDisplay()} = $value;
                $item = $model;
            }

            $relation->save($item);
        }
    }
}
