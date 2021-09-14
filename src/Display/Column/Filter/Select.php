<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Traits\SelectOptionsFromModel;

class Select extends BaseColumnFilter
{
    use SelectOptionsFromModel;

    /**
     * @var string
     */
    protected $view = 'column.filter.select';

    /**
     * @var Model
     */
    protected $model;

    /**
     * @var array
     */
    protected $options = [];

    /**
     * @var string
     */
    protected $placeholder;

    /**
     * @var bool
     */
    protected $multiple = false;

    /**
     * @var bool
     */
    protected $sortable = true;

    /**
     * @var mixed
     */
    protected $defaultValue = null;

    /**
     * Select constructor.
     *
     * @param  null|array|Model  $options
     * @param  null|string  $title
     *
     * @throws \SleepingOwl\Admin\Exceptions\Form\Element\SelectException
     */
    public function __construct($options = null, $title = null)
    {
        parent::__construct();

        if (is_array($options)) {
            $this->setOptions($options);
        } elseif (($options instanceof Model) || is_string($options)) {
            $this->setModelForOptions($options);
        }

        if (! is_null($title)) {
            $this->setDisplay($title);
        }
    }

    /**
     * @return $this
     */
    public function multiple()
    {
        $this->multiple = true;

        return $this;
    }

    /**
     * @throws \SleepingOwl\Admin\Exceptions\FilterOperatorException
     */
    public function initialize()
    {
        parent::initialize();

        $this->setHtmlAttribute('class', 'form-control input-select column-filter');
        $this->setHtmlAttribute('data-type', 'select');

        if ($this->multiple) {
            $this->setHtmlAttribute('multiple', 'multiple');

            if (! in_array($this->operator, ['in', 'not_in'])) {
                $this->setOperator('in');
            }
        } else {
            $this->setHtmlAttribute('placeholder', $this->getPlaceholder());
        }
    }

    /**
     * @param  bool  $sortable
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
     * @param $model
     * @return \SleepingOwl\Admin\Display\Column\Filter\Select
     *
     * @throws \SleepingOwl\Admin\Exceptions\Form\Element\SelectException
     */
    public function setModel($model)
    {
        return $this->setModelForOptions($model);
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

        $options = $this->options;
        if ($this->isSortable()) {
            asort($options);
        }

        return $options;
    }

    /**
     * @param  array  $options
     * @return $this
     */
    public function setOptions(array $options)
    {
        $this->options = $options;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getDefault()
    {
        return $this->defaultValue;
    }

    /**
     * @param  mixed  $value
     * @return $this
     */
    public function setDefault($value)
    {
        $this->defaultValue = $value;

        return $this;
    }

    /**
     * @return string
     */
    public function getPlaceholder()
    {
        return $this->placeholder;
    }

    /**
     * @param  string  $placeholder
     * @return $this
     */
    public function setPlaceholder($placeholder)
    {
        $this->placeholder = $placeholder;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'options' => $this->getOptions(),
            'default' => $this->getDefault(),
        ];
    }

    /**
     * @param  mixed  $selected
     * @return array
     */
    public function parseValue($selected)
    {
        if (is_string($selected) && strpos($selected, ':::') !== false) {
            return explode(':::', $selected);
        }

        return $selected;
    }
}
