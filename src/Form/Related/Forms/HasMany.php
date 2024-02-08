<?php

namespace SleepingOwl\Admin\Form\Related\Forms;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Form\Element\MultiSelect;
use SleepingOwl\Admin\Form\Element\Image;
use SleepingOwl\Admin\Form\Related\Elements;

class HasMany extends Elements
{
    public function initialize()
    {
        parent::initialize();

        $this->modifyQuery(function (Builder $query) {
            $query->orderBy($this->getEmptyRelation()->getRelated()->getKeyName());
        });
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return mixed|void
     */
    protected function proceedSave(Request $request)
    {
        $relation = $this->getRelation();

        // First we need to remove all entities
        if (! $this->toRemove->isEmpty()) {
            $class = get_class($relation->getRelated());
            $class::destroy($this->toRemove->all());
        }
        $relation->saveMany($this->relatedValues);
    }

    /**
     * @param  array  $data
     * @return mixed|void
     */
    protected function prepareRelatedValues(array $data)
    {
        $elements = $this->flatNamedElements($this->getNewElements());
        foreach ($data as $relatedId => $attributes) {
            $related = $this->addOrGetRelated($relatedId);

            foreach ($elements as $element) {
                $attribute = $element->getModelAttributeKey();
                $value = $element->prepareValue(Arr::get($attributes, $attribute));

                //for model hasmany->multiselect
                if ($element instanceof MultiSelect) {
                    $model = $attributes instanceof Model ? $attributes : $this->safeCreateModel($this->getModelClassForElements(), $attributes);

                    $element->setModel($model->find($relatedId));

                    $request = new Request();
                    $value = is_null($value) ? [] : $value;
                    $request->replace([$element->getPath() => $value]);
                    $element->setValueSkipped(false);
                    $element->afterSave($request);
                    continue;
                }

                $related->setAttribute($attribute, $value);
                $element->setModel($related);

                //for model hasmany->image, images
                if ($element instanceof Image) {
                    $request = new Request();
                    $request->replace([$element->getPath() => $value]);
                    $element->afterSave($request);
                }
            }
        }
    }

    /**
     * @param  $query
     * @return \Illuminate\Support\Collection
     */
    protected function retrieveRelationValuesFromQuery($query): Collection
    {
        $removeKeys = $this->toRemove->all();
        $related = $this->getRelation()->getRelated();

        return $query->get()->keyBy($related->getKeyName())->forget($removeKeys);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Model
     */
    protected function getModelForElements(): Model
    {
        return $this->getEmptyRelation()->getRelated();
    }

    /**
     * Returns fresh instance of model for each element in form.
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    protected function getFreshModelForElements(): Model
    {
        $class = get_class($this->getEmptyRelation()->getRelated());

        return new $class();
    }
}
