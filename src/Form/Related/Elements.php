<?php

namespace SleepingOwl\Admin\Form\Related;

use DB;
use Illuminate\Http\Request;
use Admin\Contracts\HasFakeModel;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Form\FormElements;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Form\Element\NamedFormElement;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\RelationNotFoundException;

abstract class Elements extends FormElements
{
    use HtmlAttributes, HasUniqueValidation, ManipulatesRequestRelations;

    protected $view = 'form.element.related.elements';

    const NEW_ITEM = 'new';

    const REMOVE = 'remove';

    /**
     * How many items can be created.
     *
     * @var int
     */
    protected $limit;

    /**
     * Relation name of the model.
     *
     * @var string
     */
    protected $relationName;

    /**
     * New relations counter.
     *
     * @var int
     */
    protected $new = 0;

    /**
     * @var string
     */
    protected $groupLabel;

    /**
     * Main label of dynamic form.
     *
     * @var string
     */
    protected $label;

    /**
     * Loaded related values.
     *
     * @var \Illuminate\Support\Collection
     */
    protected $relatedValues;

    /**
     * @var \Illuminate\Database\Eloquent\Model
     */
    protected $instance;

    protected $stubElements;

    /**
     * Elements that are about to be removed.
     *
     * @var \Illuminate\Support\Collection
     */
    protected $toRemove;

    protected $emptyRelation;

    /**
     * @var
     */
    protected $groups;

    protected $queryCallbacks = [];

    public function __construct($relationName, array $elements = [])
    {
        $this->toRemove = collect();
        $this->groups = collect();
        $this->relatedValues = collect();
        parent::__construct($elements);

        $this->setRelationName($relationName);
        $this->initializeRemoveEntities();
    }

    /**
     * @param int $limit
     *
     * @return $this
     */
    public function setLimit($limit)
    {
        $this->limit = $limit;

        return $this;
    }

    /**
     * Adds query modifier callback for related values select. Here you may define your ordering, etc.
     *
     * @param callable $callback
     *
     * @return $this
     */
    public function modifyQuery(callable $callback)
    {
        $this->queryCallbacks[] = $callback;

        return $this;
    }

    /**
     * Sets the label of related form.
     *
     * @param $label
     *
     * @return $this
     */
    public function setLabel($label)
    {
        $this->label = $label;

        return $this;
    }

    public function initialize()
    {
        parent::initialize();
        $this->checkRelationOfModel();

        $this->stubElements = $this->getNewElements();
        $this->forEachElement($this->stubElements, function ($element) {
            $element->setDefaultValue(null);
            if (! $element instanceof HasFakeModel) {
                $element->setPath('');
            }
        });
    }

    protected function initializeRemoveEntities()
    {
        $key = $this->relationName.'.'.static::REMOVE;
        $newKey = 'remove_'.$this->relationName;
        $request = request();

        $remove = $request->input($key, $request->old($key, []));
        if ($remove) {
            $request->merge([$newKey => $remove]);
        }

        $this->toRemove = collect($request->input($newKey, $request->old($newKey, [])));
        $request->replace($request->except($key));
    }

    /**
     * @return void
     */
    public function initializeElements()
    {
        $this->getElements()->each(function ($element) {
            if ($element instanceof Initializable) {
                $element->initialize();
            }

            if ($element instanceof HasFakeModel) {
                $element->setFakeModel($this->getModel());
            }
        });
    }

    /**
     * @param $item
     *
     * @param array $columns
     *
     * @return string
     */
    protected function getCompositeKey($item, array $columns): string
    {
        $primaries = [];
        if ($item instanceof Model) {
            $item = $item->getAttributes();
        }

        foreach ($columns as $name) {
            // Only existing keys must be in primaries array
            if (array_key_exists($name, $item)) {
                $primaries[] = $item[$name];
            }
        }

        return implode('_', $primaries);
    }

    protected function makeValidationAttribute($name)
    {
        return $this->relationName.'.*.'.$name;
    }

    protected function getNewElements()
    {
        return $this->cloneElements($this);
    }

    protected function cloneElements(FormElements $element)
    {
        $elements = clone $element->getElements()->map(function ($element) {
            return clone $element;
        });

        return $elements->map(function ($element) {
            return $this->emptyElement($element);
        });
    }

    protected function emptyElement($element)
    {
        $el = clone $element;
        if ($el instanceof \SleepingOwl\Admin\Form\Columns\Columns) {
            $col = new Columns();
            $columns = $el->getElements();
            $col->setElements((clone $columns)->map(function ($column) {
                return $this->emptyElement($column);
            })->all());

            return $col;
        }

        if ($el instanceof FormElements) {
            $el->setElements($this->cloneElements($el)->all());
        } else {
            $el->setDefaultValue(null);
            $el->setValueSkipped(true);
        }

        return $el;
    }

    public function setModel(Model $model)
    {
        parent::setModel($model);

        if ($model->exists) {
            $this->setInstance($model);
            $this->loadRelationValues();
        }
    }

    public function setInstance($instance)
    {
        $this->instance = $instance;
    }

    protected function checkRelationOfModel()
    {
        $model = $this->getModel();
        $class = get_class($model);
        if (! method_exists($model, $this->relationName)) {
            throw new RelationNotFoundException("Relation {$this->relationName} doesn't exist on {$class}");
        }

        $relation = $model->{$this->relationName}();
        if (! ($relation instanceof BelongsToMany) && ! ($relation instanceof HasOneOrMany)) {
            throw new \InvalidArgumentException("Relation {$this->relationName} of model {$class} must be instance of HasMany or BelongsToMany");
        }
    }

    /**
     * Sets relation name property.
     *
     * @param string
     *
     * @return $this
     */
    public function setRelationName($name)
    {
        $this->relationName = $name;

        return $this;
    }

    protected function loadRelationValues()
    {
        if (! $this->instance) {
            throw new ModelNotFoundException("Model {$this->getModel()} wasn't found for loading relation");
        }

        $query = $this->getRelation();
        if (count($this->queryCallbacks) > 0) {
            foreach ($this->queryCallbacks as $callback) {
                $callback($query);
            }
        }

        $this->relatedValues = $this->retrieveRelationValuesFromQuery($query);
    }

    /**
     * @param \Illuminate\Http\Request|null $request
     *
     * @return array
     */
    protected function getRequestData(Request $request = null)
    {
        return $request ? $request->get($this->relationName, []) : old($this->relationName, []);
    }

    protected function buildGroupsCollection()
    {
        $relatedValues = $this->relatedValues;

        if (count($old = $this->getRequestData()) !== 0) {
            $relatedValues = $this->getRelatedValuesFromRequestData($old);
            $old = true;
        }

        foreach ($relatedValues as $key => $item) {
            $this->groups->push($this->createGroup($item, $old, $key));
        }
    }

    protected function getRelatedValuesFromRequestData(array $values)
    {
        $collection = collect();
        foreach ($values as $key => $attributes) {
            if ($key === static::REMOVE) {
                // If key is about to be removed we need to save it and show later in rendered form. But we don't
                // need to put value with this relation in collection of elements, that's why we need to continue the
                // loop
                $this->toRemove = collect($attributes);
                continue;
            }

            if (strpos($key, static::NEW_ITEM) !== false) {
                // If item is new wee need to implement counter of new items to prevent duplicates,
                // check limits and etc.
                $this->new++;
            }

            if ($this->relatedValues->has($key)) {
                $attributes = $this->safeFillModel($this->relatedValues->get($key), $attributes);
            }

            // Finally, we put filled model values into collection of future groups
            $collection->put($key, $attributes);
        }

        return $collection;
    }

    /**
     * Creates new group of relation and returns it.
     *
     * @param array|Model $attributes Attributes of one group (relation)
     * @param bool $old Is it old data from previous request after validation error or something like that
     * @param null $key Key of attributes
     *
     * @return \SleepingOwl\Admin\Form\Related\Group
     */
    protected function createGroup($attributes, $old = false, $key = null)
    {
        $model = $attributes instanceof Model ? $attributes : $this->safeCreateModel($this->getModelClassForElements(), $attributes);
        $group = new Group($model);

        if ($this->groupLabel) {
            $group->setLabel($this->groupLabel);
        }

        $this->forEachElement($elements = $this->getNewElements(), function (NamedFormElement $el) use ($model, $key, $old) {
            // Setting default value, name and model for element with name attribute
            $el->setDefaultValue($el->prepareValue($this->getElementValue($model, $el)));
            $el->setName(sprintf('%s[%s][%s]', $this->relationName, $key ?: $model->getKey(), $this->formatElementName($el->getName())));
            $el->setModel($model);

            if ($old && strpos($el->getPath(), '->') === false && ! ($el instanceof HasFakeModel)) {
                // If there were old values (validation fail, etc.) each element must have different path to get the old
                // value. If we don't do it, there will be collision if two elements with same name present in main form
                // and related form. For example: we have "Company" and "Shop" models with field "name" and include HasMany
                // form with company's shops inside "Companies" section. There will be collisions of "name" if validation
                // fails, and each "shop"-form will have "company->name" value inside "name" field.
                $el->setPath($el->getName());
            }
        });

        foreach ($elements as $el) {
            $group->push($el);
        }

        return $group;
    }

    /**
     * Returns value from model for given element.
     *
     * @param \Illuminate\Database\Eloquent\Model $model
     * @param \SleepingOwl\Admin\Form\Element\NamedFormElement $el
     *
     * @return mixed|null
     */
    protected function getElementValue(Model $model, NamedFormElement $el)
    {
        $attribute = $el->getModelAttributeKey();
        if (strpos($attribute, '->') === false) {
            return $model->getAttribute($attribute);
        }

        // Parse json attributes
        $casts = collect($model->getCasts());
        $jsonParts = collect(explode('->', $attribute));
        $cast = $casts->get($jsonParts->first(), false);

        if (! in_array($cast, ['json', 'array'])) {
            return;
        }

        $jsonAttr = $model->{$jsonParts->first()};

        return array_get($jsonAttr, $jsonParts->slice(1)->implode('.'));
    }

    /**
     * Replaces element name to key of entity.
     *
     * @param string $name
     *
     * @return null|string|string[]
     */
    protected function formatElementName($name)
    {
        return preg_replace("/{$this->relationName}\[[\w]+\]\[(.+?)\]/", '$1', $name);
    }

    /**
     * Applies given callback to every element of form.
     *
     * @param \Illuminate\Support\Collection $elements
     * @param $callback
     */
    protected function forEachElement(Collection $elements, $callback)
    {
        foreach ($this->flatNamedElements($elements) as $element) {
            $callback($element);
        }
    }

    /**
     * Returns flat collection of elements in form ignoring everything but NamedFormElement. Works recursive.
     *
     * @param \Illuminate\Support\Collection $elements
     *
     * @return mixed
     */
    protected function flatNamedElements(Collection $elements)
    {
        return $elements->reduce(function (Collection $initial, $element) {
            if ($element instanceof NamedFormElement) {
                // Is it what we're loogin for? if so we'll push it to final collection
                $initial->push($element);
            } elseif ($element instanceof FormElements) {
                // Go deeper and repeat everything again
                return $initial->merge($this->flatNamedElements($element->getElements()));
            }

            return $initial;
        }, collect());
    }

    /**
     * Creates new model of given class and calls fill on it.
     *
     * @param $modelClass
     * @param array $attributes
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    protected function safeCreateModel($modelClass, array $attributes = [])
    {
        return $this->safeFillModel(new $modelClass, $attributes);
    }

    /**
     * Fills given model with given attributes using setAttributes, not batch fill
     * to prevent guard errors of model attributes.
     *
     * @param \Illuminate\Database\Eloquent\Model $model
     * @param array $attributes
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    protected function safeFillModel(Model $model, array $attributes = [])
    {
        foreach ($attributes as $attribute => $value) {
            // Prevent numeric attribute name. If it is, so it's an error
            if (is_numeric($attribute)) {
                continue;
            }

            try {
                $model->setAttribute($attribute, $value);
            } catch (\Exception $exception) {
                // Ignore attribute set exception
            }
        }

        return $model;
    }

    /**
     * Returns empty relation of model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\Relation
     */
    protected function getEmptyRelation()
    {
        return $this->emptyRelation ?: $this->emptyRelation = $this->getModel()->{$this->relationName}();
    }

    /**
     * Returns relation of current instance.
     *
     * @return mixed
     */
    protected function getRelation()
    {
        return $this->instance->{$this->relationName}();
    }

    /**
     * Saves request.
     *
     * @param \Illuminate\Http\Request $request
     */
    public function save(Request $request)
    {
        $this->prepareRelatedValues($this->getRequestData($request));

        $this->transactionLevel = DB::transactionLevel();
        DB::beginTransaction();
        // Nothing to do here...
    }

    /**
     * @param array $rules
     *
     * @return array
     */
    public function getValidationRulesFromElements(array $rules = [])
    {
        $this->flatNamedElements($this->getElements())->each(function ($element) use (&$rules) {
            $rules += $this->modifyValidationParameters($element->getValidationRules());
        });

        return $rules;
    }

    public function getValidationMessagesForElements(array $messages = [])
    {
        $this->flatNamedElements($this->getElements())->each(function ($element) use (&$messages) {
            $messages += $this->modifyValidationParameters($element->getValidationMessages());
        });

        return $messages;
    }

    public function afterSave(Request $request)
    {
        try {
            // By this time getModel method will always return existed model object, not empty
            // so wee need to fresh it, because if it's new model creating relation will throw
            // exception 'call relation method on null'
            $this->setInstance($this->getModel());
            $this->proceedSave($request);
            DB::commit();

            $this->prepareRequestToBeCopied($request);
        } catch (\Throwable $exception) {
            \Session::flash('success_message', 'Произошла ошибка сохранения');
            DB::rollBack($this->transactionLevel);

            throw $exception;
        }
    }

    /**
     * Returns model class for each element in form.
     *
     * @return string
     */
    protected function getModelClassForElements()
    {
        return get_class($this->getModelForElements());
    }

    /**
     * Modifies validation parameters appending asterisk (*) to every field. We need this stuff because we're creating
     * grouped forms here, you know :).
     *
     * @param array $parameters
     *
     * @return array
     */
    protected function modifyValidationParameters(array $parameters)
    {
        $result = [];
        foreach ($parameters as $name => $parameter) {
            $result["{$this->relationName}.*.{$name}"] = $parameter;
        }

        return $result;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        $this->buildGroupsCollection();

        return parent::toArray() + [
                'stub'             => $this->stubElements,
                'name'             => $this->relationName,
                'label'            => $this->label,
                'groups'           => $this->groups,
                'remove'           => $this->toRemove,
                'newEntitiesCount' => $this->new,
                'limit'            => $this->limit,
            ];
    }

    /**
     * @param string $groupLabel
     *
     * @return $this
     */
    public function setGroupLabel($groupLabel)
    {
        $this->groupLabel = $groupLabel;

        return $this;
    }

    /**
     * Checks if count of limit is exceeded.
     *
     * @return int
     */
    public function exceedsLimit()
    {
        if ($this->limit === null) {
            return false;
        }

        return $this->relatedValues->count() >= $this->limit;
    }

    /**
     * Appends fresh related model if total count is not exceeding limit.
     *
     * @param $key
     *
     * @return Model
     */
    protected function addOrGetRelated($key)
    {
        $related = $this->relatedValues->get($key) ?: $this->getFreshModelForElements();

        if (! $related->exists && ! $this->exceedsLimit()) {
            $this->relatedValues->put($key, $related);
        }

        return $related;
    }

    /**
     * @return $this
     */
    public function disableCreation()
    {
        $this->setLimit(0);

        return $this;
    }

    /**
     * Retrieves related values from given query.
     *
     * @param $query
     *
     * @return Collection
     */
    abstract protected function retrieveRelationValuesFromQuery($query);

    /**
     * Returns model for each element in form.
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    abstract protected function getModelForElements();

    /**
     * Returns fresh instance of model for each element in form.
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    abstract protected function getFreshModelForElements();

    /**
     * Proceeds saving related values after all validations passes.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return mixed
     */
    abstract protected function proceedSave(Request $request);

    /**
     * Here you must add all new relations to main collection and etc.
     *
     * @param array $data
     *
     * @return mixed
     */
    abstract protected function prepareRelatedValues(array $data);
}
