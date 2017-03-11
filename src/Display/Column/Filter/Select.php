<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

use Illuminate\Database\Eloquent\Model;

class Select extends BaseColumnFilter
{
    use \SleepingOwl\Admin\Traits\SelectOptionsFromModel;

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
     * @param array|Model|string|null $options
     * @param string|null $title
     */
    public function __construct($options = null, $title = null)
    {
        parent::__construct();

        if (is_array($options)) {
            $this->setOptions($options);
        } elseif (($options instanceof Model) or is_string($options)) {
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
     * @param Model|string $model
     *
     * @deprecated use setModelForOptions
     * @return $this
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
        if (! is_null($this->getModelForOptions()) and ! is_null($this->getDisplay())) {
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
     * @param array $options
     *
     * @return $this
     */
    public function setOptions(array $options)
    {
        $this->options = $options;

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
     * @param string $placeholder
     *
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
            'options'     => $this->getOptions(),
        ];
    }

    /**
     * @param mixed $selected
     *
     * @return array
     */
    public function parseValue($selected)
    {
        if (is_string($selected) && strpos($selected, ',') !== false) {
            return explode(',', $selected);
        }

        return $selected;
    }
}
