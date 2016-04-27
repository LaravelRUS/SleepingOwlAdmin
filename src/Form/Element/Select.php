<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Exceptions\Form\Element\SelectException;

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
     * @var array
     */
    protected $exclude = [];

    /**
     * @var string|null
     */
    protected $foreignKey = null;

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
     * @return Model
     */
    public function getModelForOptions()
    {
        return $this->modelForOptions;
    }

    /**
     * @param @param string|Model $modelForOptions
     *
     * @return $this
     * @throws SelectException
     */
    public function setModelForOptions($modelForOptions)
    {
        if (is_string($modelForOptions)) {
            $modelForOptions = app($modelForOptions);
        }

        if (! ($modelForOptions instanceof Model)) {
            throw new SelectException('Class must be instanced of Illuminate\Database\Eloquent\Model');
        }

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
     * @return $this
     */
    public function onlyEmptyRelation()
    {
        $this->isEmptyRelation = true;

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
     * @param null|string $foreignKey
     *
     * @return $this
     */
    public function setForeignKey($foreignKey)
    {
        $this->foreignKey = $foreignKey;

        return $this;
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
            $options = [null => trans('sleeping_owl::lang.select.nothing')] + $options;
        }

        $options = array_except($options, $this->exclude);

        return parent::toArray() + [
            'options' => $options,
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
            $options->where($this->getForeignKey(), 0)->orWhereNull($this->getForeignKey());
        }

        $options = $options->get()->pluck($this->getDisplay(), $key);

        if ($options instanceof Collection) {
            $options = $options->all();
        }

        $this->setOptions($options);
    }

    /**
     * @param mixed $value
     *
     * @return mixed
     */
    protected function prepareValue($value)
    {
        if ($this->isNullable() and $value == '') {
            return;
        }

        return $value;
    }
}
