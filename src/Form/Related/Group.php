<?php

namespace SleepingOwl\Admin\Form\Related;

class Group extends \Illuminate\Support\Collection
{
    /**
     * @var \Illuminate\Database\Eloquent\Model
     */
    protected $model;

    /**
     * @var string|callable
     */
    protected $label;

    protected $primary;

    public function __construct(\Illuminate\Database\Eloquent\Model $model = null, $items = [])
    {
        $this->model = $model;

        parent::__construct($items);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function getModel()
    {
        return $this->model;
    }

    public function getPrimary()
    {
        $primary = $this->primary;

        if (is_callable($primary)) {
            return $primary($this->getModel());
        }

        return $primary ?: optional($this->getModel())->getKey();
    }

    public function setPrimary($primary)
    {
        $this->primary = $primary;

        return $this;
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
    public function getLabel()
    {
        return is_callable($this->label) ? $this->label($this) : $this->label;
    }
}
