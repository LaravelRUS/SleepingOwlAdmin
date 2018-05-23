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
    use HtmlAttributes, HasUniqueValidation;

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

    protected $toRemove;

    protected $emptyRelation;

    protected $unique;

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

    public function modifyQuery(callable $callback)
    {
        $this->queryCallbacks[] = $callback;

        return $this;
    }

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

        $this->initializeRemoveEntities();
    }

    protected function initializeRemoveEntities()
    {
        $key = $this->relationName.'.'.static::REMOVE;

        $this->toRemove = collect(request()->input($key, []));

        request()->replace(array_except(request()->all(), $this->relationName.'.'.static::REMOVE));
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
    protected function getCompositeKey($item, array $columns)
    {
        $primaries = [];
        foreach ($columns as $name) {
            $primaries[] = $item[$name];
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
            if (strpos($key, static::NEW_ITEM) !== false) {
                $this->new++;
            }

            if ($this->relatedValues->has($key)) {
                $attributes = $this->safeFillModel($this->relatedValues->get($key), $attributes);
            }

            $collection->put($key, $attributes);
        }

        return $collection;
    }

    protected function createGroup($attributes, $old = false, $key = null)
    {
        $model = $attributes instanceof Model ? $attributes : $this->safeCreateModel($this->getModelClassForElements(), $attributes);
        $group = new Group($model);

        if ($this->groupLabel) {
            $group->setLabel($this->groupLabel);
        }

        $this->forEachElement($elements = $this->getNewElements(), function (NamedFormElement $el) use ($model, $key, $old) {
            // Setting default value, name and model for element with name attribute
            $el->setDefaultValue($el->prepareValue($model->getAttribute($el->getModelAttributeKey())));
            $el->setName(sprintf('%s[%s][%s]', $this->relationName, $key ?: $model->getKey(), $this->formatElementName($el->getName())));
            $el->setModel($model);

            if ($old) {
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

    protected function formatElementName($name)
    {
        return preg_replace("/{$this->relationName}\[[\w]+\]\[(.+?)\]/", '$1', $name);
    }

    protected function forEachElement(Collection $elements, $callback)
    {
        foreach ($this->flatNamedElements($elements) as $element) {
            $callback($element);
        }
    }

    protected function flatNamedElements(Collection $elements)
    {
        return $elements->reduce(function (Collection $initial, $element) {
            if ($element instanceof NamedFormElement) {
                $initial->push($element);
            } elseif ($element instanceof FormElements) {
                return $initial->merge($this->flatNamedElements($element->getElements()));
            }

            return $initial;
        }, collect());
    }

    protected function safeCreateModel($modelClass, array $attributes = [])
    {
        return $this->safeFillModel(new $modelClass, $attributes);
    }

    protected function safeFillModel(Model $model, array $attributes = [])
    {
        foreach ($attributes as $attribute => $value) {
            $model->setAttribute($attribute, $value);
        }

        return $model;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\Relation
     */
    protected function getEmptyRelation()
    {
        return $this->emptyRelation ?: $this->emptyRelation = $this->getModel()
            ->{$this->relationName}();
    }

    protected function getRelation()
    {
        return $this->instance->{$this->relationName}();
    }

    public function save(Request $request)
    {
        $this->prepareRelatedValues($this->getRequestData($request));

        $this->transactionLevel = DB::transactionLevel();
        DB::beginTransaction();
        // Nothing to do here...
    }

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

    abstract protected function proceedSave(Request $request);

    abstract protected function prepareRelatedValues(array $data);
}
