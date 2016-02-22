<?php

namespace SleepingOwl\Admin\Form\Element;

use Request;

abstract class NamedFormElement extends BaseFormElement
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
        $this->readonly = (bool)$readonly;

        return $this;
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

        if (! is_null($model) && ! is_null($value = $model->getAttribute($this->getAttribute()))) {
            return $value;
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

                $item  = 'unique:'.$table.','.$this->getAttribute();
                if ($model->exists()) {
                    $item .= ','.$model->getKey();
                }
            }
        });

        return [$this->getName() => $rules];
    }

    /**
     * @return $this
     */
    public function required()
    {
        $this->addValidationRule('required');

        return $this;
    }

    /**
     * @return $this
     */
    public function unique()
    {
        $this->addValidationRule('_unique');

        return $this;
    }

    /**
     * @return array
     */
    public function getParams()
    {
        return parent::getParams() + [
            'id'       => $this->getName(),
            'name'     => $this->getName(),
            'label'    => $this->getLabel(),
            'readonly' => $this->isReadonly(),
            'value'    => $this->getValue(),
            'helpText' => $this->getHelpText(),
        ];
    }

    public function save()
    {
        $attribute = $this->getAttribute();

        if (Request::get($this->getPath()) === null) {
            $value = null;
        } else {
            $value = $this->getValue();
        }

        $this->setValue($attribute, $value);
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
