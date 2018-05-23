<?php

namespace SleepingOwl\Admin\Form\Related\Forms;

use SleepingOwl\Admin\Form\Related\Elements;

class HasMany extends Elements
{
    public function initialize()
    {
        parent::initialize();

        $this->modifyQuery(function ($query) {
            $query->orderBy($this->getEmptyRelation()->getRelated()->getKeyName());
        });
    }

    protected function proceedSave(\Illuminate\Http\Request $request)
    {
        $relation = $this->getRelation();

        // First we need to remove all entities
        if (! $this->toRemove->isEmpty()) {
            $class = get_class($relation->getRelated());
            $class::destroy($this->toRemove->all());
        }

        $relation->saveMany($this->relatedValues);
    }

    protected function prepareRelatedValues(array $data)
    {
        $elements = $this->flatNamedElements($this->getNewElements());
        foreach ($data as $relatedId => $attributes) {
            $related = $this->addOrGetRelated($relatedId);

            foreach ($elements as $element) {
                $attribute = $element->getModelAttributeKey();
                $value = $element->prepareValue(array_get($attributes, $attribute));
                $related->setAttribute($attribute, $value);
                $element->setModel($related);
            }
        }
    }

    protected function retrieveRelationValuesFromQuery($query)
    {
        return $query->get()->keyBy($this->getRelation()->getRelated()->getKeyName());
    }

    protected function getModelForElements()
    {
        return $this->getEmptyRelation()->getRelated();
    }

    /**
     * Returns fresh instance of model for each element in form.
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    protected function getFreshModelForElements()
    {
        $class = get_class($this->getEmptyRelation()->getRelated());

        return new $class();
    }
}
