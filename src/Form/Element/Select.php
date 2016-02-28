<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Repository\BaseRepository;

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
        asort($options);

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
     * @param bool|true $nullable
     *
     * @return $this
     */
    public function nullable()
    {
        $this->nullable = true;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'options'  => $this->getOptions(),
            'nullable' => $this->isNullable(),
        ];
    }

    protected function loadOptions()
    {
        $repository = new BaseRepository($this->getModelForOptions());

        $key = $repository->getModel()->getKeyName();
        $options = $repository->getQuery()->get()->lists($this->getDisplay(), $key);
        if ($options instanceof Collection) {
            $options = $options->all();
        }

        $this->setOptions($options);
    }
}
