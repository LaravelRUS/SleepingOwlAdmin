<?php

namespace SleepingOwl\Admin\Form\Related\Forms;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Form\Related\Elements;
use SleepingOwl\Admin\Form\Columns\Column;
use SleepingOwl\Admin\Form\Columns\Columns;
use SleepingOwl\Admin\Form\Related\Select;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Class ManyToMany
 *
 * @package Admin\Form\Elements\RelatedElements\Forms
 *
 * @method BelongsToMany getEmptyRelation()
 */
class ManyToMany extends Elements
{
    /**
     * Relation name of the model.
     *
     * @var string
     */
    protected $relationName;

    protected $primaries;

    protected $relatedElement;

    /**
     * @var Columns
     */
    protected $relatedWrapper;

    public function __construct($relationName, array $elements = [])
    {
        $elements = array_prepend($elements, $this->relatedElement = new Select('__new_element__'));

        parent::__construct($relationName, $elements);
    }

    public function getPrimaries()
    {
        return $this->primaries ?: [
            $this->getEmptyRelation()->getForeignPivotKeyName(),
            $this->getRelatedForeignKeyName(),
        ];
    }

    public function setPrimaries(array $primaries)
    {
        $this->primaries = $primaries;
    }

    public function getRelatedElement()
    {
        return $this->relatedElement;
    }

    /**
     * @return void
     */
    public function initializeElements()
    {
        $this->initializeRelatedElement();
        parent::initializeElements();

    }

    protected function initializeRelatedElement()
    {
        $select = $this->getRelatedElement();

        $select->setName($name = $this->getRelatedForeignKeyName());
        $select->setModelAttributeKey($name);
        $select->setPath($this->getEmptyRelation()->getRelated()->getKeyName());
        $select->setModelForOptions(get_class($this->getEmptyRelation()->getRelated()));
        $select->setModel($this->getModelForElements());
        $select->required();

        $this->unique([$name], trans('sleeping_owl::lang.form.unique'));

        if ($this->relatedWrapper) {
            $this->getElements()->forget(0);
            $column = new Column([$select]);
            $this->relatedWrapper->getElements()->prepend($column);
        }
    }

    protected function retrieveRelationValuesFromQuery($query)
    {
        return $query->get()->pluck('pivot')->keyBy(function ($item) {
            return $this->getKeyFromItem($item);
        })->forget($this->toRemove->all());
    }

    /**
     * @param $item
     *
     * @return string
     */
    protected function getKeyFromItem($item)
    {
        return $this->getCompositeKey($item, $this->getPrimaries());
    }

    /**
     * @param \Illuminate\Support\Collection $values
     *
     * @return Collection
     */
    protected function buildRelatedMap(Collection $values)
    {
        $relatedKey = $this->getRelatedForeignKeyName();

        return $values->mapWithKeys(function ($attributes) use ($relatedKey) {
            return [
                array_get($attributes, $relatedKey) => array_except($attributes, [
                    $relatedKey,
                    $this->getEmptyRelation()->getForeignPivotKeyName(),
                ]),
            ];
        });
    }

    protected function getRelatedForeignKeyName()
    {
        return $this->getEmptyRelation()->getRelatedPivotKeyName();
    }

    protected function proceedSave(Request $request)
    {
        // By this time getModel method will always return existed model object, not empty
        // so wee need to fresh it, because if it's new model creating relation will throw
        // exception 'call relation method on null'
        $relation = $this->getRelation();
        $relation->sync($this->buildRelatedMap($this->relatedValues));
    }

    protected function prepareRelatedValues(array $data)
    {
        $elements = $this->flatNamedElements($this->getNewElements());
        foreach ($data as $key => $attributes) {
            $related = $this->addOrGetRelated($key);

            foreach ($elements as $index => $element) {
                $attribute = $element->getModelAttributeKey();
                $value = $element->prepareValue(array_get($attributes, $attribute));
                $related->setAttribute($attribute, $value);

                $element->setModel($related);
            }
        }
    }

    protected function getModelForElements()
    {
        return $this->getEmptyRelation()->newPivot();
    }

    public function wrapRelatedInto(Columns $columns)
    {
        $this->relatedWrapper = $columns;
    }

    public function dontWrap()
    {
        $this->relatedWrapper = null;
    }

    public function __call($name, $arguments)
    {
        if (method_exists($this->getRelatedElement(), $name)) {
            $this->getRelatedElement()->$name(...$arguments);
        }

        throw new \RuntimeException("Method {$name} doesn't exist.");
    }

    /**
     * Returns fresh instance of model for each element in form.
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    protected function getFreshModelForElements()
    {
        return $this->getModelForElements();
    }
}
