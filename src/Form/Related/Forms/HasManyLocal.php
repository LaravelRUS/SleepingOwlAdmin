<?php

namespace SleepingOwl\Admin\Form\Related\Forms;

use Admin\Contracts\HasFakeModel;
use Exception;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Form\Columns\ColumnInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Exceptions\Form\FormElementException;
use SleepingOwl\Admin\Form\Columns\Columns;
use SleepingOwl\Admin\Form\Element\Custom;
use SleepingOwl\Admin\Form\Element\DependentSelect;
use SleepingOwl\Admin\Form\Element\File;
use SleepingOwl\Admin\Form\Element\Files;
use SleepingOwl\Admin\Form\Element\Image;
use SleepingOwl\Admin\Form\Element\MultiDependentSelect;
use SleepingOwl\Admin\Form\Element\NamedFormElement;
use SleepingOwl\Admin\Form\Element\Textarea;
use SleepingOwl\Admin\Form\FormElements;
use SleepingOwl\Admin\Form\Related\Group;
use SleepingOwl\Admin\Form\Related\HasUniqueValidation;
use SleepingOwl\Admin\Form\Related\ManipulatesRequestRelations;
use SleepingOwl\Admin\Traits\Collapsed;

class HasManyLocal extends FormElements
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
     * New records counter.
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
    protected $fieldValues;

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

    protected $transactionLevel;

    /**
     * @var string
     */
    protected $fieldName;

    /**
     * @var string
     */
    protected $helpText;

    /**
     * @var null|callable
     */
    protected $saveCallback = null;

    /**
     * @var null|callable
     */
    protected $loadCallback = null;

    /**
     * @var int
     */
    protected $jsonOptions = 0;

    /**
     * @var string
     */
    protected $saveMode = 'json';

    /**
     * @var bool
     */
    // protected $needToSetValueSkipped = false;

    /**
     * @var callable|null|false
     */
    // protected $emptyElementCallback;

    /**
     * @var bool
     */
    protected $draggable = true;

    /**
     * HasManyLocal constructor.
     *
     * @param  string  $fieldName
     * @param  array  $elements
     * @param  string  $label
     */
    public function __construct(string $fieldName, array $elements = [], $label = '')
    {
        $this->toRemove = collect();
        $this->groups = collect();
        $this->fieldValues = collect();
        $this->setLabel($label);

        if (config('sleeping_owl.useHasManyLocalCard')) {
            $this->setCard();
        }

        parent::__construct($elements);

        $this->setFieldName($fieldName);
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

    /**
     * @param  string  $label
     * @return $this
     */
    public function setLabel(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    public function initialize()
    {
        parent::initialize();

        $this->stubElements = $this->getNewElements();
        $this->forEachElement($this->stubElements, function ($element) {
            //$element->setDefaultValue(null);
            if (! $element instanceof HasFakeModel) {
                if (! $element instanceof Image && ! $element instanceof Textarea && ! $element instanceof File) {
                    $element->setPath('');
                }

                // Disabled elements for using inside hasManyLocal
                $disabledElements = [
                    Files::class => 'files',
                    DependentSelect::class => 'dependentselect',
                    MultiDependentSelect::class => 'multidependentselect',
                ];
                foreach ($disabledElements as $elementClass => $elementName) {
                    if ($element instanceof $elementClass) {
                        throw new FormElementException('Form element ['.$elementName.'] is not implemented to use inside hasManyLocal yet, sorry');
                    }
                }
            }
        });
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

    /**
     * @param $element
     * @return Columns|Custom|FormElements
     *
     * @throws Exception
     */
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

            // Save process: v2
            // if (is_object($el) && $this->needToSetValueSkipped()) {
            //     $el->setValueSkipped(true);
            // }
        }

        // Save process: v2
        // if (is_callable($this->emptyElementCallback)) {
        //     call_user_func($this->emptyElementCallback, $el);
        // }

        /**
         * Write this in your Section if you want to provide model instance directly
         * or use uploadable (like image) fields inside your hasManyLocal element:
         *      ->setInstance($model).
         *
         * You can get model instance inside onEdit() via $this->getModelValue()
         */
        if ($this->getInstance()) {
            $el->setModel($this->getInstance());
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
            $this->loadFieldValues();
        }
    }

    /**
     * @return Model
     */
    public function getInstance()
    {
        return $this->instance;
    }

    /**
     * @param $instance
     * @return $this
     */
    public function setInstance($instance)
    {
        $this->instance = $instance;

        return $this;
    }

    /**
     * Sets field name property.
     *
     * @param string
     * @return HasManyLocal
     */
    public function setFieldName(string $name): self
    {
        $this->fieldName = $name;

        return $this;
    }

    public function getFieldName(): string
    {
        return $this->fieldName;
    }

    /**
     * @throws Exception
     */
    protected function loadFieldValues()
    {
        $this->fieldValues = $this->getFieldValues();
    }

    /**
     * @return array
     */
    protected function getRequestData(): array
    {
        /*
        // v1
        $request = request();

        $old = $request->old($this->fieldName, false);

        return $old ?: $request->get($this->fieldName, []);
        */

        // v2 - allow to use hasManyLocal for elements inside array, for example:
        // AdminFormElement::hasManyLocal('foo[bar]', [])
        $request = request();
        $fieldName = strtr($this->fieldName, ['[' => '.', ']' => '']);
        $old = Arr::get($request->old(), $fieldName);
        $new = Arr::get($request->all(), $fieldName);

        return $old ?: $new ?: [];
    }

    protected function buildGroupsCollection($plus_one = true)
    {
        $old = false;
        $relatedValues = $this->fieldValues;

        if (count($data = $this->getRequestData()) !== 0) {
            $old = true;
            $relatedValues = $this->getRelatedValuesFromRequestData($data);
        }

        foreach ($relatedValues as $key => $item) {
            // +1 is very important for correct frontend logic work
            if (is_numeric($key) && $plus_one) {
                $key += 1;
            }
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

            if ($this->fieldValues->has($key)) {
                $attributes = $this->safeFillModel($this->fieldValues->get($key), $attributes);
            }

            // Finally, we put filled model values into collection of future groups
            $collection->put($key, $attributes);
        }

        return $collection;
    }

    protected function createGroup($attributes, $old = false, $key = null): Group
    {
        if (is_string($attributes)) {
            $attributes = is_callable($this->getLoadCallback()) ? $this->getLoadCallback()($attributes) : json_decode($attributes, true);
        }
        $model = $attributes instanceof Model
            ? $attributes
            : (
            null != ($instanceModel = $this->getInstance())
                ? $this->safeFillModel(clone $instanceModel, $attributes)
                : $this->safeCreateModel($this->getModelClassForElements(), $attributes)
            );
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
            $el->setName(sprintf('%s[%s][%s]', $this->fieldName, $key ?? $model->getKey(), $this->formatElementName($el->getName())));
            $el->setComposeId($el->getName());
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

    /**
     * @param  string  $name
     * @return string|string[]|null
     */
    protected function formatElementName(string $name)
    {
        return preg_replace(
            '~\[]$~',
            '',
            preg_replace("/{$this->fieldName}\[[\w]+\]\[(.+?)\]/", '$1', $name)
        );
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

    /**
     * @param  string  $modelClass
     * @param  array  $attributes
     * @return Model
     */
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
            } catch (\Throwable $exception) {
                // Not add Attribute
            }
        }

        return $model;
    }

    /**
     * Saves request.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @throws Exception
     */
    public function save(Request $request)
    {
        $this->setFieldValues($request);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     */
    public function afterSave(Request $request)
    {
        //
    }

    /**
     * @param  Request  $request
     * @return void
     *
     * @throws Exception
     */
    protected function setFieldValues(Request $request)
    {
        /*
         * TODO: Need to bring to mind save process
         */
        /*
        // Save process: v2 - call ->save($request) method for each form element inside each of hasManyLocal group with data from Request
        $model = $this->getModel();

        // Get default field values (not from Request!) & build hasManyLocal group stubs (blocks with data)
        $this->fieldValues = collect($this->fieldValues);
        $this->setNeedToSetValueSkipped(false);
        $this->setEmptyElementCallback(function ($el) {
            if ($el instanceof NamedFormElement) {
                $el->setModelAttributeKey($this->fieldName . '[' . count($this->groups) . '][' . $el->getModelAttributeKey() . ']');
            }
            return $el;
        });
        $this->buildGroupsCollection(false);
        $this->setEmptyElementCallback(null);
        $this->setNeedToSetValueSkipped(true);

        // First we need to remove entities if it's required
        if (! $this->toRemove->isEmpty()) {
            $value = @(array)json_decode($model->{$this->getFieldName()}, true);
            foreach ($this->toRemove as $key) {
                unset($value[$key - 1]);
            }
            $model->{$this->getFieldName()} = json_encode($value, $this->getJsonOptions());
        }

        // Then - process all other items
        // Process each group...
        $g = 0;
        foreach ($this->groups as $group) {
            // Process each form elements in group...
            foreach ($group->all() as $group_element) {
                // Need to setup only "real" form elements with data (text, select, textarea, etc.),
                // not "arrangement" elements (columns, tabs, etc.)
                if ($group_element instanceof NamedFormElement) {
                    // Make some hooks with form element
                    $group_element->setModel($this->getModel());
                    #$group_element->setModelAttributeKey($this->fieldName . '[' . $g . '][' . $group_element->getModelAttributeKey() . ']');
                    #$group_element->setValueSkipped(false);
                }
                // Call ->save($request) method
                $group_element->save($request);
            }
            ++$g;
        }
        */

        // Save process: v1 - directly set JSON'ed value (plain text from Request) to model attribute
        $values = $this->getRequestData();
        unset($values['remove']);
        $result_value = array_values($values);
        $save_callback = $this->getSaveCallback();

        if (is_callable($save_callback)) {
            $result_value = $save_callback($result_value);
        } elseif ($this->getSaveMode() == 'array') {
            // to do nothing
        } elseif ($this->getSaveMode() == 'json') {
            $result_value = json_encode($result_value, $this->getJsonOptions());
        } else {
            throw new Exception('Unknown save mode: '.$this->getSaveMode());
        }

        $this->getModel()->setAttribute($this->getFieldName(), $result_value);
    }

    /**
     * @return array
     *
     * @throws Exception
     */
    protected function getFieldValues(): array
    {
        $value = $this->instance->{$this->fieldName};
        if (is_array($value)) {
            return $value;
        } elseif (is_string($value)) {
            return @(array) json_decode($value, true);
        } elseif ($value instanceof Collection) {
            return $value->toArray();
        } elseif ($value === null || $value === false || $value === '') {
            return [];
        } else {
            throw new Exception('Model field must return array, json-string or instance of Collection');
        }
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
     * Returns model class for each element in form.
     *
     * @return string
     */
    protected function getModelClassForElements(): string
    {
        return get_class($this->getModelForElements());
    }

    /**
     * @return \Illuminate\Database\Eloquent\Model
     */
    protected function getModelForElements(): Model
    {
        return $this->getModel();
    }

    /**
     * @param  array  $parameters
     * @return array
     */
    protected function modifyValidationParameters(array $parameters): array
    {
        $result = [];
        foreach ($parameters as $name => $parameter) {
            $result["{$this->fieldName}.*.{$name}"] = $parameter;
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
            'name' => $this->fieldName,
            'label' => $this->label,
            'groups' => $this->groups,
            'remove' => $this->toRemove,
            'newEntitiesCount' => $this->new,
            'limit' => $this->limit,
            'attributes' => $this->htmlAttributesToString(),
            'helpText' => $this->getHelpText(),
            'draggable' => $this->getDraggable(),
            'collapsed' => $this->getCollapsed(),
            'deletable' => $this->isDeletable(),
        ];
    }

    /**
     * @param  string  $groupLabel
     * @return HasManyLocal
     */
    public function setGroupLabel(string $groupLabel): self
    {
        $this->groupLabel = $groupLabel;

        return $this;
    }

    /**
     * @return HasManyLocal
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

    /**
     * @return callable|null
     */
    public function getSaveCallback(): ?callable
    {
        return $this->saveCallback;
    }

    /**
     * @param  callable|null  $saveCallback
     * @return HasManyLocal
     */
    public function setSaveCallback(?callable $saveCallback): self
    {
        $this->saveCallback = $saveCallback;

        return $this;
    }

    /**
     * @return int
     */
    public function getJsonOptions(): int
    {
        return $this->jsonOptions;
    }

    /**
     * @param  int  $jsonOptions
     * @return HasManyLocal
     */
    public function setJsonOptions(int $jsonOptions): self
    {
        $this->jsonOptions = $jsonOptions;

        return $this;
    }

    /**
     * @return callable|null
     */
    public function getLoadCallback(): ?callable
    {
        return $this->loadCallback;
    }

    /**
     * @param  callable|null  $loadCallback
     */
    public function setLoadCallback(?callable $loadCallback): void
    {
        $this->loadCallback = $loadCallback;
    }

    /**
     * @return string
     */
    public function getSaveMode(): string
    {
        return $this->saveMode;
    }

    /**
     * @param  string  $saveMode
     * @return HasManyLocal
     */
    public function setSaveMode(string $saveMode): self
    {
        $this->saveMode = $saveMode;

        return $this;
    }

    /**
     * @return HasManyLocal
     */
    public function storeAsArray(): self
    {
        $this->setSaveMode('array');

        return $this;
    }

    /**
     * Use storeAsArray() method.
     *
     * @return HasManyLocal
     *
     * @deprecated
     */
    public function saveAsArray(): self
    {
        return $this->storeAsArray();
    }

    /**
     * @return HasManyLocal
     */
    public function storeAsJson(): self
    {
        $this->setSaveMode('json');

        return $this;
    }

    /**
     * Use storeAsJson() method.
     *
     * @return HasManyLocal
     *
     * @deprecated
     */
    public function saveAsJson(): self
    {
        return $this->storeAsJson();
    }

    /**
     * @return bool
     */
    public function getDraggable()
    {
        return (bool) $this->draggable;
    }

    /**
     * @param  bool  $draggable
     * @return $this
     */
    public function setDraggable($draggable)
    {
        $this->draggable = $draggable;

        return $this;
    }

    /**
     * @return bool
     */
    // public function needToSetValueSkipped(): bool
    // {
    //     return $this->needToSetValueSkipped;
    // }

    /**
     * @param  bool  $needToSetValueSkipped
     */
    // public function setNeedToSetValueSkipped(bool $needToSetValueSkipped): void
    // {
    //     $this->needToSetValueSkipped = $needToSetValueSkipped;
    // }

    /**
     * @return callable|false|null
     */
    // public function getEmptyElementCallback()
    // {
    //     return $this->emptyElementCallback;
    // }

    /**
     * @param  callable|false|null  $emptyElementCallback
     */
    // public function setEmptyElementCallback($emptyElementCallback): void
    // {
    //     $this->emptyElementCallback = $emptyElementCallback;
    // }
}
