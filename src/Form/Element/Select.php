<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\RepositoryInterface;

class Select extends NamedFormElement
{
    /**
     * @var Model
     */
    protected $modelForOptions;

    /**
     * @var string
     */
    protected $display = 'title';

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
     * @var bool
     */
    protected $isEmptyRelation = false;

    /**
     * @param string      $path
     * @param string|null $label
     * @param array|Model       $options
     */
    public function __construct($path, $label = null, $options = [])
    {
        parent::__construct($path, $label);

        if (is_array($options)) {
            $this->setOptions($options);
        } elseif ($options instanceof Model) {
            $this->setModelForOptions($options);
        }
    }

    /**
     * @return Model
     */
    public function getModelForOptions()
    {
        return $this->modelForOptions;
    }

    /**
     * @param Model $modelForOptions
     *
     * @return $this
     */
    public function setModelForOptions(Model $modelForOptions)
    {
        $this->modelForOptions = $modelForOptions;

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
        if (! is_null($this->getModelForOptions()) && ! is_null($this->getDisplay())) {
            $this->loadOptions();
        }

        $options = $this->options;
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
     * @param bool $state
     * @return $this
     */
    public function setEmptyRelation(bool $state)
    {
        $this->isEmptyRelation = $state;

        return $this;
    }

    /**
     * @return bool
     */
    public function isEmptyRelation()
    {
        return $this->isEmptyRelation;
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

        if ($this->isNullable()) {
            $attributes['data-nullable'] = 'true';
        }

        $options = $this->getOptions();

        if ($this->isNullable()) {
            array_unshift($options, '');
        }

        return parent::toArray() + [
            'options'  => $this->getOptions(),
            'nullable' => $this->isNullable(),
            'attributes' => $attributes,
        ];
    }

    /**
     * @var RepositoryInterface
     */
    protected function loadOptions()
    {
        $repository = app(RepositoryInterface::class, [$this->getModelForOptions()]);

        $key = $repository->getModel()->getKeyName();

        $options = $repository->getQuery();

        if ($this->isEmptyRelation()) {
            $options->where($this->getModel()->getForeignKey(), 0);
        }

        $options = $options->get()->lists($this->getDisplay(), $key);

        if ($options instanceof Collection) {
            $options = $options->all();
        }

        $this->setOptions($options);
    }
}
