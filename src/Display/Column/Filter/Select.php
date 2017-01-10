<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\RepositoryInterface;

class Select extends BaseColumnFilter
{
    /**
     * @var string
     */
    protected $view = 'column.filter.select';

    /**
     * @var Model
     */
    protected $model;

    /**
     * @var string
     */
    protected $display = 'title';

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
     * @param array|Model|string|null $options
     * @param string|null $title
     */
    public function __construct($options = null, $title = null)
    {
        parent::__construct();

        if (is_array($options)) {
            $this->setOptions($options);
        } else if (! is_null($options)) {
            $this->setModel($options);
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
     * @return Model
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * @param Model|string $model
     *
     * @return $this
     * @throws \Exception
     */
    public function setModel($model)
    {
        if (is_string($model) and class_exists($model)) {
            $model = new $model;
        }

        if (! ($model instanceof Model)) {
            throw new \Exception('Model must be an instance of Illuminate\Database\Eloquent\Model');
        }

        $this->model = $model;

        return $this;
    }

    /**
     * @return string
     */
    public function getDisplay()
    {
        return $this->display;
    }

    /**
     * @param string $display
     *
     * @return $this
     */
    public function setDisplay($display)
    {
        $this->display = $display;

        return $this;
    }

    /**
     * @return array
     */
    public function getOptions()
    {
        if (! is_null($this->getModel()) and ! is_null($this->getDisplay())) {
            $this->loadOptions();
        }

        $options = $this->options;
        asort($options);

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
            'options'     => $this->getOptions()
        ];
    }

    protected function loadOptions()
    {
        $repository = app(RepositoryInterface::class, [$this->getModel()]);

        $key = $repository->getModel()->getKeyName();
        $options = $repository->getQuery()->get()->pluck($this->getDisplay(), $key);

        if ($options instanceof Collection) {
            $options = $options->all();
        }

        $options = array_unique($options);
        $this->setOptions($options);
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
