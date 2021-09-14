<?php

namespace SleepingOwl\Admin\Form\Related\Forms;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Form\Columns\Column;
use SleepingOwl\Admin\Form\Columns\Columns;
use SleepingOwl\Admin\Form\Related\Elements;
use SleepingOwl\Admin\Form\Related\Select;

class ManyToMany extends Elements
{
    protected $primaries;

    protected $relatedElement;

    protected $relatedElementDisplayName;

    /**
     * @var Columns
     */
    protected $relatedWrapper;

    /**
     * ManyToMany constructor.
     *
     * @param $relationName
     * @param  array  $elements
     *
     * @throws \SleepingOwl\Admin\Exceptions\Form\Element\SelectException
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormElementException
     */
    public function __construct($relationName, array $elements = [])
    {
        $elements = Arr::prepend($elements, $this->relatedElement = new Select('__new_element__'));

        parent::__construct($relationName, $elements);
    }

    /**
     * @return array
     */
    public function getPrimaries(): array
    {
        return $this->primaries ?? [
            $this->getEmptyRelation()->getForeignPivotKeyName(),
            $this->getRelatedForeignKeyName(),
        ];
    }

    /**
     * Sets primaries of relation.
     *
     * @param  array  $primaries
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
        if ($display = $this->getRelatedElementDisplayName()) {
            $select->setDisplay($display);
        }
        $select->required();

        $this->unique(empty($this->unique) ? [$name]
            : array_merge([$name], $this->unique), trans('sleeping_owl::lang.form.unique'));

        if ($this->relatedWrapper) {
            $this->getElements()->forget(0);
            $column = new Column([$select]);
            $this->relatedWrapper->getElements()->prepend($column);
        }
    }

    protected function retrieveRelationValuesFromQuery($query): Collection
    {
        return $query->get()->pluck('pivot')->keyBy(function ($item) {
            return $this->getKeyFromItem($item);
        })->forget($this->toRemove->all());
    }

    /**
     * @param $item
     * @return string
     */
    protected function getKeyFromItem($item): string
    {
        return $this->getCompositeKey($item, $this->getPrimaries());
    }

    /**
     * @param  \Illuminate\Support\Collection  $values
     * @return Collection
     */
    protected function buildRelatedMap(Collection $values): Collection
    {
        $relatedKey = $this->getRelatedForeignKeyName();

        $chunksIterator = 0;
        $chunks = [];
        foreach ($values as $pivot) {
            if (! array_key_exists($chunksIterator, $chunks)) {
                $chunks[$chunksIterator] = [];
            }

            // If the same related key already exists in our chunk, we'll switch chunk to next
            // and fill it with new attributes to prevent duplication of related ids in single
            // array
            if (array_key_exists($key = $pivot->getAttribute($relatedKey), $chunks[$chunksIterator])) {
                $chunksIterator++;
            }

            $chunks[$chunksIterator][$key] = Arr::except($pivot->getAttributes(), [
                $relatedKey,
                $this->getEmptyRelation()->getForeignPivotKeyName(),
            ]);
        }

        return collect($chunks);
    }

    /**
     * @return string
     */
    protected function getRelatedForeignKeyName(): string
    {
        return $this->getEmptyRelation()->getRelatedPivotKeyName();
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return mixed|void
     */
    protected function proceedSave(Request $request)
    {
        // By this time getModel method will always return existed model object, not empty
        // so wee need to fresh it, because if it's new model creating relation will throw
        // exception 'call relation method on null'
        $relation = $this->getRelation();

        // First, we need to detach all records from table because we can't use sync
        // on chunked array
        $relation->detach();

        // We'll iterate over each chunk of related values and attach it
        foreach ($this->buildRelatedMap($this->relatedValues) as $chunk) {
            foreach ($chunk as $id => $attributes) {
                $relation->attach($id, $attributes);
            }
        }
    }

    protected function prepareRelatedValues(array $data)
    {
        $elements = $this->flatNamedElements($this->getNewElements());
        foreach ($data as $key => $attributes) {
            $related = $this->addOrGetRelated($key);

            foreach ($elements as $index => $element) {
                $attribute = $element->getModelAttributeKey();
                $value = $element->prepareValue(Arr::get($attributes, $attribute));
                $related->setAttribute($attribute, $value);

                $element->setModel($related);
            }
        }
    }

    /**
     * @return \Illuminate\Database\Eloquent\Model
     */
    protected function getModelForElements(): Model
    {
        return $this->getEmptyRelation()->newPivot();
    }

    /**
     * Wraps first element into given columns. It's useful when you have Columns in your form and want the related
     * element to be inside this columns.
     *
     * @param  \SleepingOwl\Admin\Form\Columns\Columns  $columns
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
     * Returns fresh instance of model for each element in form.
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    protected function getFreshModelForElements(): Model
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
     * @param  string  $value
     * @return $this
     */
    public function setRelatedElementDisplayName($value)
    {
        $this->relatedElementDisplayName = $value;

        return $this;
    }

    /**
     * @param $name
     * @param $arguments
     * @return $this
     */
    public function __call($name, $arguments)
    {
        $this->getRelatedElement()->$name(...$arguments);

        return $this;
    }
}
