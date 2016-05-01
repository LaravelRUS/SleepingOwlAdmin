<?php

namespace SleepingOwl\Admin\Form\Element;

use Carbon\Carbon;
use Request;
use LogicException;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Form\FormElement;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * TODO Has to be a bit more test friendly. Too many facades.
 */
abstract class NamedFormElement extends FormElement
{

    /**
     * @var string
     */
    protected $path;

    /**
     * @var string
     */
    protected $name;

    /**
     * @var string
     */
    protected $attribute;

    /**
     * @var string
     */
    protected $label;

    /**
     * @var string
     */
    protected $helpText;

    /**
     * @var mixed
     */
    protected $defaultValue;

    /**
     * @var bool
     */
    protected $readonly = false;

    /**
     * @var array
     */
    protected $validationMessages = [];

    /**
     * @param string      $path
     * @param string|null $label
     */
    public function __construct($path, $label = null)
    {
        $this->setPath($path);
        $this->setLabel($label);

        $parts = explode('.', $path);
        $this->setName($this->composeName($parts));
        $this->setAttribute(end($parts));
    }

    /**
     * Compose html name from array like this: 'first[second][third]'.
     *
     * @param array $parts
     *
     * @return string
     */
    private function composeName(array $parts)
    {
        $name = array_shift($parts);

        while (! empty($parts)) {
            $part = array_shift($parts);
            $name .= "[$part]";
        }

        return $name;
    }

    /**
     * @return string
     */
    public function getPath()
    {
        return $this->path;
    }

    /**
     * @param string $path
     *
     * @return $this
     */
    public function setPath($path)
    {
        $this->path = $path;

        return $this;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     *
     * @return $this
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return string
     */
    public function getLabel()
    {
        return $this->label;
    }

    /**
     * @param string $label
     *
     * @return $this
     */
    public function setLabel($label)
    {
        $this->label = $label;

        return $this;
    }

    /**
     * @return string
     */
    public function getAttribute()
    {
        return $this->attribute;
    }

    /**
     * @param string $attribute
     *
     * @return $this
     */
    public function setAttribute($attribute)
    {
        $this->attribute = $attribute;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getDefaultValue()
    {
        return $this->defaultValue;
    }

    /**
     * @param mixed $defaultValue
     *
     * @return $this
     */
    public function setDefaultValue($defaultValue)
    {
        $this->defaultValue = $defaultValue;

        return $this;
    }

    /**
     * @return $this
     *
     * SMELLS This function does more than it says.
     */
    public function setCurrentDate()
    {
        $this->defaultValue = Carbon::now();

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
     * @param string $helpText
     *
     * @return $this
     */
    public function setHelpText($helpText)
    {
        $this->helpText = $helpText;

        return $this;
    }

    /**
     * @return bool
     */
    public function isReadonly()
    {
        return $this->readonly;
    }

    /**
     * @param bool $readonly
     *
     * @return $this
     */
    public function setReadonly($readonly)
    {
        $this->readonly = (bool) $readonly;

        return $this;
    }

    /**
     * @param string      $rule
     * @param string|null $message
     *
     * @return $this
     */
    public function addValidationRule($rule, $message = null)
    {
        parent::addValidationRule($rule);

        if (is_null($message)) {
            return $this;
        }

        if (is_string($rule) and ($pos = strpos($rule, ':')) !== false) {
            $rule = substr($rule, 0, $pos);
        }

        return $this->addValidationMessage($rule, $message);
    }

    /**
     * @param string|null $message
     *
     * @return $this
     */
    public function required($message = null)
    {
        $this->addValidationRule('required', $message);

        return $this;
    }

    /**
     * @param string|null $message
     *
     * @return $this
     */
    public function unique($message = null)
    {
        $this->addValidationRule('_unique', $message);

        return $this;
    }

    /**
     * @return array
     */
    public function getValidationMessages()
    {
        $messages = parent::getValidationMessages();

        foreach ($this->validationMessages as $rule => $message) {
            $messages[$this->getName().'.'.$rule] = $message;
        }

        return $messages;
    }

    /**
     * @param array $validationMessages
     *
     * @return $this
     */
    public function setValidationMessages(array $validationMessages)
    {
        $this->validationMessages = $validationMessages;

        return $this;
    }

    /**
     * @param string $rule
     * @param string $message
     *
     * @return $this
     */
    public function addValidationMessage($rule, $message)
    {
        $this->validationMessages[$rule] = $message;

        return $this;
    }

    /**
     * @return array
     */
    public function getValidationLabels()
    {
        return [$this->getPath() => $this->getLabel()];
    }

    /**
     * HACK Needs refactoring and reasoning.
     * @return mixed
     */
    public function getValue()
    {
        if (! is_null($value = Request::old($this->getPath()))) {
            return $value;
        }

        // HACK This is not the right place for Request facade.
        $input = Request::all();

        if (($value = array_get($input, $this->getPath())) !== null) {
            return $value;
        }

        $model = $this->getModel();
        $value = $this->getDefaultValue();

        if (is_null($model)) {
            return $value;
        }

        $relations = explode('.', $this->getPath());
        $count = count($relations);

        if ($count === 1) {
            return $model->getAttribute($this->getAttribute());
        }

        foreach ($relations as $relation) {

            if ($model->{$relation} instanceof Model) {
                $model = $model->{$relation};
                continue;
            }

            if ($count === 2) {
                return $model->getAttribute($relation);
            }

            throw new LogicException("Can not fetch value for field '{$this->getPath()}'. Probably relation definition is incorrect");
        }

        return $value;
    }

    /**
     * If FormElement has `_unique` rule, it will get all appropriate
     * validation rules based on underlying model.
     *
     * @return array
     */
    public function getValidationRules()
    {
        $rules = parent::getValidationRules();

        
        foreach ($rules as &$rule) {
            if ($rule !== '_unique'){
                continue;
            }

            $model = $this->getModel();
            $table = $model->getTable();

            $rule = 'unique:'.$table.','.$this->getAttribute();
            
            if ($model->exists()) {
                $rule .= ','.$model->getKey();
            }
        }
        unset($rule);

        return [$this->getPath() => $rules];
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'id'       => $this->getName(),
            'name'     => $this->getName(),
            'path'     => $this->getPath(),
            'label'    => $this->getLabel(),
            'readonly' => $this->isReadonly(),
            'value'    => $this->getValue(),
            'helpText' => $this->getHelpText(),
            'required' => in_array('required', $this->validationRules),
        ];
    }

    public function save()
    {
        $attribute = $this->getAttribute();
        $model = $this->getModel();

        $value = $this->getValue();

        $relations = explode('.', $this->getPath());
        $count = count($relations);
        $i = 1;

        if ($count > 1) {
            $i++;
            $previousModel = $model;

            /* @var Model $model */
            foreach ($relations as $relation) {
                $nestedModel = null;
                if ($previousModel->{$relation} instanceof Model) {
                    $relatedModel = &$previousModel->{$relation};
                } elseif (method_exists($previousModel, $relation)) {

                    /* @var Relation $relation */
                    $relationObject = $previousModel->{$relation}();
                    switch (get_class($relationObject)) {
                        case BelongsTo::class:
                            $relationObject->associate($relatedModel = $relationObject->getRelated());
                            break;
                        case HasOne::class:
                            $relatedModel = $relationObject->create();
                            $model->{$relation} = $relatedModel;
                            break;
                    }
                }

                $previousModel = $relatedModel;
                if ($i === $count) {
                    break;
                } elseif (is_null($relatedModel)) {
                    throw new LogicException("Field «{$this->getPath()}» can't be mapped to relations of model ".get_class($model).'. Probably some dot delimeted segment is not a supported relation type');
                }
            }

            $model = $previousModel;
        }

        $this->setValue($model, $attribute, $this->prepareValue($value));
    }

    /**
     * @param Model  $model
     * @param string $attribute
     * @param mixed  $value
     */
    protected function setValue(Model $model, $attribute, $value)
    {
        $model->setAttribute($attribute, $value);
    }

    /**
     * @param mixed $value
     *
     * @return mixed
     */
    protected function prepareValue($value)
    {
        return $value;
    }
}
