<?php

namespace SleepingOwl\Admin\Form\Related\Forms;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Form\Columns\Column;
use SleepingOwl\Admin\Form\Related\Select;
use SleepingOwl\Admin\Form\Columns\Columns;
use SleepingOwl\Admin\Form\Related\Elements;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Class ManyToMany.
 *
 * @method BelongsToMany getEmptyRelation()
 */
class ManyToMany extends Elements
{
    protected $primaries;

    protected $relatedElement;

    protected $relatedElementDisplayName;

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

    /**
     * Sets primaries of relation.
     *
     * @param array $primaries
     */
    public function setPrimaries(array $primaries)
    {
        $this->primaries = $primaries;
    }

    /**
     * Returns related element (first select if it's important).
     *
     * @return mixed
     */
    public function getRelatedElement()
    {
        return $this->relatedElement;
    }

    /**
     * Initializes all elements.
     *
     * @return void
     */
    public function initializeElements()
    {
        $this->initializeRelatedElement();
        parent::initializeElements();
    }

    /**
     * Initializes related element. First element (select) is created by default because it's many-to-many, you know.
     */
    protected function initializeRelatedElement()
    {
        $select = $this->getRelatedElement();

        $select->setName($name = $this->getRelatedForeignKeyName());
        $select->setModelAttributeKey($name);
        $select->setPath($this->getEmptyRelation()->getRelated()->getKeyName());
        $select->setModelForOptions(get_class($this->getEmptyRelation()->getRelated()));
        $select->setModel($this->getModelForElements());
        $select->setDisplay($this->getRelatedElementDisplayName());
        $select->required();

        $this->unique([$name], trans('sleeping_owl::lang.form.unique'));

        if ($this->relatedWrapper) {
            $this->getElements()->forget(0);
            $column = new Column([$select]);
            $this->relatedWrapper->getElements()->prepend($column);
        }
    }

    /**
     * Retrieves related values from given query.
     *
     * @param $query
     *
     * @return Collection
     */
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

    /**
     * Returns related foreign key name.
     *
     * @return string
     */
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

    /**
     * @param array $data
     *
     * @return mixed|void
     */
    protected function prepareRelatedValues(array $data)
    {
        $elements = $this->flatNamedElements($this->getNewElements());
        foreach ($data as $key => $attributes) {
            $related = $this->addOrGetRelated($key);

            foreach ($elements as $index => $element) {
                $attribute = $element->getModelAttributeKey();

                $element->setModel($related);
                $element->setPath($attribute);
                $element->setValueSkipped(false);
                $element->setModelAttribute(array_get($attributes, $attribute));
            }
        }
    }

    /**
     * @return \Illuminate\Database\Eloquent\Model|\Illuminate\Database\Eloquent\Relations\Pivot
     */
    protected function getModelForElements()
    {
        return $this->getEmptyRelation()->newPivot();
    }

    /**
     * Wraps first element into given columns. It's useful when you have Columns in your form and want the related
     * element to be inside this columns.
     *
     * @param \SleepingOwl\Admin\Form\Columns\Columns $columns
     */
    public function wrapRelatedInto(Columns $columns)
    {
        $this->relatedWrapper = $columns;
    }

    /**
     * Cancels related element wrapping.
     */
    public function dontWrap()
    {
        $this->relatedWrapper = null;
    }

    /**
     * Proxies method call to related element.
     *
     * @param $name
     * @param $arguments
     */
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

    /**
     * @return string
     */
    public function getRelatedElementDisplayName()
    {
        return $this->relatedElementDisplayName;
    }

    /**
     * @param string $value
     * @return $this
     */
    public function setRelatedElementDisplayName($value)
    {
        $this->relatedElementDisplayName = $value;

        return $this;
    }
}
