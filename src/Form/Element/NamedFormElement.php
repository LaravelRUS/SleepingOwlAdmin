<?php

namespace SleepingOwl\Admin\Form\Element;

use Request;
use LogicException;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Form\FormElement;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
    protected $readonly;
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
        $this->setLabel($label);
        $parts = explode('.', $path);
        $this->setPath($path);

        if (count($parts) > 1) {
            $this->setName($parts[0].'['.implode('][', array_slice($parts, 1)).']');
            $this->setAttribute(implode('.', array_slice(explode('.', $path), -1, 1)));
        } else {
            $this->setName($path);
            $this->setAttribute($path);
        }
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

        if (! is_null($message)) {
            if (is_string($rule) and ($pos = strpos($rule, ':')) !== false) {
                $rule = substr($rule, 0, $pos);
            }

            $this->addValidationMessage($rule, $message);
        }

        return $this;
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
    public function setValidationMessages($validationMessages)
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
     * @return mixed
     */
    public function getValue()
    {
        $model = $this->getModel();
        if (! is_null($value = old($this->getPath()))) {
            return $value;
        }

        $input = Request::all();

        if (($value = array_get($input, $this->getPath())) !== null) {
            return $value;
        }

        if (! is_null($model)) {
            $exploded = explode('.', $this->getPath());
            $i = 1;
            $count = count($exploded);

            if ($count > 1) {
                $i++;
                foreach ($exploded as $relation) {
                    if ($model->{$relation} instanceof Model) {
                        $model = $model->{$relation};
                    } elseif ($count === $i) {
                        $value = $model->getAttribute($relation);
                    } else {
                        throw new LogicException("Can not fetch value for field '{$this->getPath()}'. Probably relation definition is incorrect");
                    }
                }
            } else {
                $value = $model->getAttribute($this->getAttribute());
            }

            if (! is_null($value)) {
                return $value;
            }
        }

        return $this->getDefaultValue();
    }

    /**
     * @return array
     */
    public function getValidationRules()
    {
        $rules = parent::getValidationRules();
        array_walk($rules, function (&$item) {
            $model = $this->getModel();

            if ($item == '_unique') {
                $table = $model->getTable();

                $item = 'unique:'.$table.','.$this->getAttribute();
                if ($model->exists()) {
                    $item .= ','.$model->getKey();
                }
            }
        });

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
                            $relationObject->associate(
                                $relatedModel = $relationObject->getRelated()
                            );
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

        $model->setAttribute($attribute, $value);
    }

    /**
     * @param string $attribute
     * @param mixed $value
     */
    protected function setValue($attribute, $value)
    {
        $this->getModel()->setAttribute($attribute, $value);
    }
}
