<?php

namespace SleepingOwl\Admin\Form\Related;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class Group extends Collection
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

    public function __construct(Model $model = null, $items = [])
    {
        $this->model = $model;

        parent::__construct($items);
    }

    /**
     * @return null|\Illuminate\Database\Eloquent\Model
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

        if ($primary) {
            return $primary;
        }

        $key = optional($this->getModel())->getKeyName();

        if (is_array($key)) {
            return implode('_', $this->getModel()->only($key));
        }

        return optional($this->getModel())->getKey();
    }

    public function setPrimary($primary)
    {
        $this->primary = $primary;

        return $this;
    }

    /**
     * @param string $label
     *
     * @return Group
     */
    public function setLabel($label): self
    {
        $this->label = $label;

        return $this;
    }

    /**
     * @return null|string
     */
    public function getLabel()
    {
        return is_callable($this->label) ? call_user_func($this->label, $this) : $this->label;
    }
}
