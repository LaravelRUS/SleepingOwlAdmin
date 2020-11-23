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
use SleepingOwl\Admin\Form\Columns\Columns;
use SleepingOwl\Admin\Form\Element\Custom;
use SleepingOwl\Admin\Form\Element\NamedFormElement;
use SleepingOwl\Admin\Form\FormElements;
use SleepingOwl\Admin\Form\Related\Group;
use SleepingOwl\Admin\Form\Related\HasUniqueValidation;
use SleepingOwl\Admin\Form\Related\ManipulatesRequestRelations;

class HasManyLocal extends FormElements
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
     * @var int
     */
    protected $jsonOptions = 0;

    public function __construct(string $fieldName, array $elements = [])
    {
        $this->toRemove = collect();
        $this->groups = collect();
        $this->fieldValues = collect();
        parent::__construct($elements);

        $this->setFieldName($fieldName);
    }

    /**
     * @param int $limit
     *
     * @return $this
     */
    public function setLimit(int $limit): self
    {
        $this->limit = $limit;

        return $this;
    }

    /**
     * @param string $label
     *
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
                $element->setPath('');
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
     *
     * @return Columns|Custom|FormElements
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
            if (is_object($el)) {
                $el->setValueSkipped(true);
            }
        }

        return $el;
    }

    /**
     * @param Model $model
     *
     * @return FormElements|void
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

    public function setInstance($instance)
    {
        $this->instance = $instance;
    }

    /**
     * Sets field name property.
     *
     * @param string
     *
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
        $request = request();

        $old = $request->old($this->fieldName, false);

        return $old ?: $request->get($this->fieldName, []);
    }

    protected function buildGroupsCollection()
    {
        $old = false;
        $relatedValues = $this->fieldValues;

        if (count($data = $this->getRequestData()) !== 0) {
            $old = true;
            $relatedValues = $this->getRelatedValuesFromRequestData($data);
        }

        foreach ($relatedValues as $key => $item) {
            // +1 is very important for correct frontend logic work
            $this->groups->push($this->createGroup($item, $old, $key + 1));
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
        $model = $attributes instanceof Model
            ? $attributes
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
            $el->setName(sprintf('%s[%s][%s]', $this->fieldName, $key ?? $model->getKey(), $this->formatElementName($el->getName())));
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
     * @param \Illuminate\Database\Eloquent\Model $model
     * @param NamedFormElement $el
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

        return Arr::get($jsonAttr, $jsonParts->slice(1)->implode('.'));
    }

    /**
     * @param string $name
     *
     * @return string|string[]|null
     */
    protected function formatElementName(string $name)
    {
        return preg_replace("/{$this->fieldName}\[[\w]+\]\[(.+?)\]/", '$1', $name);
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
     * @param string $modelClass
     * @param array  $attributes
     *
     * @return Model
     */
    protected function safeCreateModel(string $modelClass, array $attributes = []): Model
    {
        return $this->safeFillModel(new $modelClass, $attributes);
    }

    /**
     * @param \Illuminate\Database\Eloquent\Model $model
     * @param array $attributes
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
     * @param \Illuminate\Http\Request $request
     */
    public function save(Request $request)
    {
        $this->setFieldValues();
    }

    /**
     * @param \Illuminate\Http\Request $request
     */
    public function afterSave(Request $request)
    {
        //#
    }

    /**
     * @return void
     */
    protected function setFieldValues()
    {
        $values = $this->getRequestData();
        unset($values['remove']);
        $result_value = array_values($values);
        $save_callback = $this->getSaveCallback();
        $result_value = is_callable($save_callback) ? $save_callback($result_value) : json_encode($result_value, $this->getJsonOptions());
        $this->getModel()->setAttribute($this->getFieldName(), $result_value);
    }

    /**
     * @return array
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
        } else {
            throw new Exception('Model field must return array, json-string or instance of Collection');
        }
    }

    /**
     * @param array $rules
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
     * @param array $messages
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
     * @param array $parameters
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
        ];
    }

    /**
     * @param string $groupLabel
     *
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
     * @param string|Htmlable $helpText
     *
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
     * @param callable|null $saveCallback
     *
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
     * @param int $jsonOptions
     *
     * @return HasManyLocal
     */
    public function setJsonOptions(int $jsonOptions): self
    {
        $this->jsonOptions = $jsonOptions;

        return $this;
    }
}
