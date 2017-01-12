<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Database\Eloquent\Model;

class Select extends NamedFormElement
{
    use \SleepingOwl\Admin\Traits\SelectOptionsFromModel;

    /**
     * @var array
     */
    protected $options = [];

    /**
     * @var bool
     */
    protected $nullable = false;

    /**
     * @var bool
     */
    protected $sortable = true;

    /**
     * @var array
     */
    protected $exclude = [];

    /**
     * @var string
     */
    protected $view = 'form.element.select';

    /**
     * @param string      $path
     * @param string|null $label
     * @param array|Model $options
     */
    public function __construct($path, $label = null, $options = [])
    {
        parent::__construct($path, $label);

        if (is_array($options)) {
            $this->setOptions($options);
        } elseif (($options instanceof Model) or is_string($options)) {
            $this->setModelForOptions($options);
        }
    }

    /**
     * @return array
     */
    public function getOptions()
    {
        if (! is_null($this->getModelForOptions()) && ! is_null($this->getDisplay())) {
            $this->setOptions(
                $this->loadOptions()
            );
        }

        $options = array_except($this->options, $this->exclude);
        if ($this->isSortable()) {
            asort($options);
        }

        return $options;
    }

    /**
     * @param array
     *
     * @return $this
     */
    public function setOptions(array $options)
    {
        $this->options = $options;

        return $this;
    }

    /**
     * @param array $values
     *
     * @return $this
     */
    public function setEnum(array $values)
    {
        return $this->setOptions(array_combine($values, $values));
    }

    /**
     * @return bool
     */
    public function isNullable()
    {
        return $this->nullable;
    }

    /**
     * @return $this
     */
    public function nullable()
    {
        $this->nullable = true;

        return $this;
    }

    /**
     * @param bool $sortable
     *
     * @return $this
     */
    public function setSortable($sortable)
    {
        $this->sortable = (bool) $sortable;

        return $this;
    }

    /**
     * @return bool
     */
    public function isSortable()
    {
        return $this->sortable;
    }

    /**
     * @param array $keys
     *
     * @return $this
     */
    public function exclude($keys)
    {
        if (! is_array($keys)) {
            $keys = func_get_args();
        }

        $this->exclude = array_filter($keys);

        return $this;
    }

    /**
     * @return null|string
     */
    public function getForeignKey()
    {
        if (is_null($this->foreignKey)) {
            return $this->foreignKey = $this->getModel()->getForeignKey();
        }

        return $this->foreignKey;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $attributes = [
            'id' => $this->getName(),
            'size' => 2,
            'data-select-type' => 'single',
            'class' => 'form-control input-select',
        ];

        if ($this->isReadonly()) {
            $attributes['disabled'] = 'disabled';
        }

        $options = $this->getOptions();

        if ($this->isNullable()) {
            $attributes['data-nullable'] = 'true';
            $options = [null => trans('sleeping_owl::lang.select.nothing')] + $options;
        }

        return parent::toArray() + [
            'options' => $options,
            'nullable' => $this->isNullable(),
            'attributes' => $attributes,
        ];
    }

    /**
     * @param mixed $value
     *
     * @return mixed
     */
    public function prepareValue($value)
    {
        if ($this->isNullable() and $value == '') {
            return;
        }

        return parent::prepareValue($value);
    }
}
