<?php

namespace SleepingOwl\Admin\Form\Related;

use Admin\Contracts\HasFakeModel;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\RelationNotFoundException;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Form\Columns\ColumnInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Form\Columns\Columns;
use SleepingOwl\Admin\Form\Element\Custom;
use SleepingOwl\Admin\Form\Element\NamedFormElement;
use SleepingOwl\Admin\Form\FormElements;
use SleepingOwl\Admin\Traits\Collapsed;
use Throwable;

abstract class Elements extends FormElements
{
    use HtmlAttributes, HasUniqueValidation, ManipulatesRequestRelations;
    use Collapsed;

    protected $view = 'form.element.related.elements_without_card';

    const NEW_ITEM = 'new';

    const REMOVE = 'remove';

    /**
     * @var bool|callable
     */
    protected $deletable = true;

    /**
     * @return bool|callable
     */
    public function isDeletable()
    {
        if (is_callable($this->deletable)) {
            return (bool) call_user_func($this->deletable, $this->getModel());
        }

        return (bool) $this->deletable;
    }

    /**
     * @param  Closure|bool  $readonly
     * @return $this
     */
    public function setDeletable($deletable)
    {
        $this->deletable = $deletable;

        return $this;
    }

    /**
     * @return $this
     */
    public function setCard(): self
    {
        $this->view = 'form.element.related.elements';

        return $this;
    }

    /**
     * @return $this
     */
    public function setMaxHeight($maxHeight): self
    {
        $this->setHtmlAttributes([
            'style' => 'overflow-y:auto;max-height:'.$maxHeight,
        ]);

        return $this;
    }

    /**
     * @var bool|null
     */
    protected $collapsed;

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

    protected $emptyRelation;

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

    protected $unique;

    /**
     * @var
     */
    protected $groups;

    protected $queryCallbacks = [];

    protected $transactionLevel;

    /**
     * @var string
     */
    protected $helpText;

    public function __construct(string $relationName, array $elements = [])
    {
        $this->toRemove = collect();
        $this->groups = collect();
        $this->relatedValues = collect();

        if (config('sleeping_owl.useRelationCard')) {
            $this->setCard();
        }

        parent::__construct($elements);

        $this->setRelationName($relationName);
        $this->initializeRemoveEntities();
    }

    /**
     * @param  int  $limit
     * @return $this
     */
    public function setLimit(int $limit): self
    {
        $this->limit = $limit;

        return $this;
    }

    public function modifyQuery(callable $callback): self
    {
        $this->queryCallbacks[] = $callback;

        return $this;
    }

    public function setLabel(string $label): self
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
            //$element->setDefaultValue(null);
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
        $this->getElements()->each(function ($el) {
            $this->initializeElement($el);
        });
    }

    public function initializeElement($element)
    {
        //ignore second initialize
        if ($element instanceof ColumnInterface) {
            return;
        }

        if ($element instanceof Initializable) {
            $element->initialize();
        }

        if ($element instanceof HasFakeModel) {
            $element->setFakeModel($this->getModel());
        }
    }

    /**
     * @param $item
     * @param  array  $columns
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

    protected function makeValidationAttribute(string $name): string
    {
        return $this->relationName.'.*.'.$name;
    }

    protected function getNewElements(): Collection
    {
        return $this->cloneElements($this);
    }

    protected function cloneElements(FormElements $element)
    {
        $elements = clone $element->getElements()->map(function ($element) {
            return is_object($element) ? clone $element : $element;
        });

        return $elements->map(function ($element) {
            return $this->emptyElement($element);
        });
    }

    protected function emptyElement($element)
    {
        $el = is_object($element) ? clone $element : $element;

        if ($el instanceof Columns) {
            $col = new Columns();
            $columns = $el->getElements();
            $columns = (clone $columns)->map(function ($column) {
                return $this->emptyElement($column);
            });
            foreach ($columns as $column) {
                $col->addColumn($column, $column->getWidth());
            }

            $col->setHtmlAttributes($el->getHtmlAttributes());
            $col->initialize();

            return $col;
        }

        if ($el instanceof FormElements) {
            $el->setElements($this->cloneElements($el)->all());
        } else {
            if (! ($el instanceof Custom)) {
                //$el->setDefaultValue(null);
            }
            if (is_object($el)) {
                $el->setValueSkipped(true);
            }
        }

        return $el;
    }

    /**
     * @param  Model  $model
     * @return FormElements|void
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
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

    /**
     * @throws \InvalidArgumentException
     * @throws \Illuminate\Database\Eloquent\RelationNotFoundException
     */
    protected function checkRelationOfModel()
    {
        $model = $this->getModel();
        $class = get_class($model);
        if (! method_exists($model, $this->relationName)) {
            throw new RelationNotFoundException("Relation {$this->relationName} doesn't exist on {$class}");
        }

        $relation = $model->{$this->relationName}();
        if (! ($relation instanceof BelongsToMany) && ! ($relation instanceof HasOneOrMany) && ! ($relation instanceof \Illuminate\Database\Eloquent\Relations\BelongsTo)) {
            throw new \InvalidArgumentException("Relation {$this->relationName} of model {$class} must be instance of HasMany, BelongsTo or BelongsToMany");
        }
    }

    /**
     * Sets relation name property.
     *
     * @param string
     * @return Elements
     */
    public function setRelationName(string $name): self
    {
        $this->relationName = $name;

        return $this;
    }

    /**
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    protected function loadRelationValues()
    {
        if (! $this->instance) {
            throw new ModelNotFoundException("Model {$this->getModel()} wasn't found for loading relation");
        }

        $query = $this->getRelation();
        if (count($this->queryCallbacks) > 0) {

            //get $query instance Illuminate\Database\Eloquent\Builder for HasMany
            $query = $query->getQuery();

            foreach ($this->queryCallbacks as $callback) {
                $callback($query);
            }
        }

        $this->relatedValues = $this->retrieveRelationValuesFromQuery($query);
    }

    /**
     * @return array
     */
    protected function getRequestData(): array
    {
        $request = request();

        $old = $request->old($this->relationName, false);

        return $old ?: $request->get($this->relationName, []);
    }

    protected function buildGroupsCollection()
    {
        $old = false;
        $relatedValues = $this->relatedValues;

        if (count($data = $this->getRequestData()) !== 0) {
            $old = true;
            $relatedValues = $this->getRelatedValuesFromRequestData($data);
        }

        foreach ($relatedValues as $key => $item) {
            $this->groups->push($this->createGroup($item, $old, $key));
        }
    }

    protected function getRelatedValuesFromRequestData(array $values): Collection
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
                // If item is new, wee need to implement counter of new items to prevent duplicates,
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

    protected function createGroup($attributes, $old = false, $key = null): Group
    {
        $model = $attributes instanceof Model ? $attributes
            : $this->safeCreateModel($this->getModelClassForElements(), $attributes);
        $group = new Group($model);

        if ($this->groupLabel) {
            $group->setLabel($this->groupLabel);
        }

        if ($key) {
            $group->setPrimary($key);
        }

        $this->forEachElement($elements = $this->getNewElements(), function (NamedFormElement $el) use ($model, $key, $old) {
            // Setting default value, name and model for element with name attribute
            $el->setDefaultValue($el->prepareValue($this->getElementValue($model, $el)));
            $el->setName(sprintf('%s[%s][%s]', $this->relationName, $key ?? $model->getKey(), $this->formatElementName($el->getName())));
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
            //add custom element for in the viewport related elements
            if ($el instanceof Custom) {
                $el->setModel($model);
            }
            $group->push($el);
        }

        return $group;
    }

    /**
     * Returns value from model for given element.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @param  NamedFormElement  $el
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

        return Arr::get($jsonAttr, $jsonParts->slice(1)->implode('.'));
    }

    protected function formatElementName(string $name)
    {
        return preg_replace("/{$this->relationName}\[[\w]+\]\[(.+?)\]/", '$1', $name);
    }

    /**
     * Applies given callback to every element of form.
     *
     * @param  \Illuminate\Support\Collection  $elements
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
     * @param  \Illuminate\Support\Collection  $elements
     * @return mixed
     */
    protected function flatNamedElements(Collection $elements)
    {
        return $elements->reduce(function (Collection $initial, $element) {
            if ($element instanceof NamedFormElement) {
                // Is it what we're looking for? if so we'll push it to final collection
                $initial->push($element);
            } elseif ($element instanceof FormElements) {
                // Go deeper and repeat everything again
                return $initial->merge($this->flatNamedElements($element->getElements()));
            }

            return $initial;
        }, collect());
    }

    protected function safeCreateModel(string $modelClass, array $attributes = []): Model
    {
        return $this->safeFillModel(new $modelClass, $attributes);
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @param  array  $attributes
     * @return \Illuminate\Database\Eloquent\Model
     */
    protected function safeFillModel(Model $model, array $attributes = []): Model
    {
        foreach ($attributes as $attribute => $value) {
            // Prevent numeric attribute name. If it is, so it's an error
            if (is_numeric($attribute)) {
                continue;
            }

            try {
                $model->setAttribute($attribute, $value);
            } catch (Throwable $exception) {
                // Not add Attribute
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
        return $this->emptyRelation ?? $this->emptyRelation = $this->getModel()->{$this->relationName}();
    }

    protected function getRelation(): Relation
    {
        return $this->instance->{$this->relationName}();
    }

    /**
     * Saves request.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function save(Request $request)
    {
        $connection = app(ConnectionInterface::class);
        $this->prepareRelatedValues($this->getRequestData());

        $this->transactionLevel = $connection->transactionLevel();
        $connection->beginTransaction();
        // Nothing to do here...
    }

    /**
     * @param  array  $rules
     * @return array
     */
    public function getValidationRulesFromElements(array $rules = []): array
    {
        $this->flatNamedElements($this->getElements())->each(function ($element) use (&$rules) {
            $rules += $this->modifyValidationParameters($element->getValidationRules());
        });

        return $rules;
    }

    /**
     * @param  array  $messages
     * @return array
     */
    public function getValidationMessagesForElements(array $messages = []): array
    {
        $this->flatNamedElements($this->getElements())->each(function ($element) use (&$messages) {
            $messages += $this->modifyValidationParameters($element->getValidationMessages());
        });

        return $messages;
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     *
     * @throws \Throwable
     */
    public function afterSave(Request $request)
    {
        $connection = app(ConnectionInterface::class);

        try {
            // By this time getModel method will always return existed model object, not empty
            // so wee need to fresh it, because if it's new model creating relation will throw
            // exception 'call relation method on null'
            $this->setInstance($this->getModel());
            $this->proceedSave($request);
            $connection->commit();

            $this->prepareRequestToBeCopied($request);
        } catch (Throwable $exception) {
            $connection->rollBack($this->transactionLevel);

            throw $exception;
        }
    }

    /**
     * Returns model class for each element in form.
     *
     * @return string
     */
    protected function getModelClassForElements(): string
    {
        return get_class($this->getModelForElements());
    }

    /**
     * @param  array  $parameters
     * @return array
     */
    protected function modifyValidationParameters(array $parameters): array
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
            'stub' => $this->stubElements,
            'name' => $this->relationName,
            'label' => $this->label,
            'groups' => $this->groups,
            'remove' => $this->toRemove,
            'newEntitiesCount' => $this->new,
            'limit' => $this->limit,
            'attributes' => $this->htmlAttributesToString(),
            'helpText' => $this->getHelpText(),
            'collapsed' => $this->getCollapsed(),
            'deletable' => $this->isDeletable(),
        ];
    }

    /**
     * @param  string  $groupLabel
     * @return Elements|\Illuminate\Database\Eloquent\Model
     */
    public function setGroupLabel(string $groupLabel): self
    {
        $this->groupLabel = $groupLabel;

        return $this;
    }

    /**
     * Checks if count of relations to be created exceeds limit.
     *
     * @return bool
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
     * @return $this
     */
    protected function addOrGetRelated($key)
    {
        $related = $this->relatedValues->get($key) ?? $this->getFreshModelForElements();

        if (! $related->exists && ! $this->exceedsLimit()) {
            $this->relatedValues->put($key, $related);
        }

        return $related;
    }

    /**
     * @return Elements
     */
    public function disableCreation(): self
    {
        $this->setLimit(0);

        return $this;
    }

    /**
     * @return string
     */
    public function getHelpText()
    {
        if ($this->helpText instanceof Htmlable) {
            return $this->helpText->toHtml();
        }

        return $this->helpText;
    }

    /**
     * @param  string|Htmlable  $helpText
     * @return $this
     */
    public function setHelpText($helpText)
    {
        $this->helpText = $helpText;

        return $this;
    }

    abstract protected function retrieveRelationValuesFromQuery($query): Collection;

    /**
     * Returns model for each element in form.
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    abstract protected function getModelForElements(): Model;

    /**
     * Returns fresh instance of model for each element in form.
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    abstract protected function getFreshModelForElements(): Model;

    /**
     * Proceeds saving related values after all validations passes.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return mixed
     */
    abstract protected function proceedSave(Request $request);

    /**
     * Here you must add all new relations to main collection and etc.
     *
     * @param  array  $data
     * @return mixed
     */
    abstract protected function prepareRelatedValues(array $data);
}
