<?php

namespace SleepingOwl\Admin\Display\Column;

use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Display\TableColumn;
use Illuminate\Database\Eloquent\Collection;
use SleepingOwl\Admin\Contracts\NamedColumnInterface;

abstract class NamedColumn extends TableColumn implements NamedColumnInterface
{
    /**
     * Column field name.
     * @var string
     */
    protected $name;

    /**
     * @param null|string $name
     * @param null|string $label
     */
    public function __construct($name, $label = null)
    {
        parent::__construct($label);
        $this->setName($name);
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
     * @return mixed
     */
    public function getModelValue()
    {
        return $this->getValueFromObject($this->getModel(), $this->getName());
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'name' => $this->getName(),
        ];
    }

    /**
     * Get column value from instance.
     *
     * @param Collection|Model $instance
     * @param string           $name
     *
     * @return mixed
     */
    protected function getValueFromObject($instance, $name)
    {
        $parts = explode('.', $name);
        $part = array_shift($parts);

        if ($instance instanceof Collection) {
            $instance = $instance->pluck($part);
        } elseif (! is_null($instance)) {
            $instance = $instance->getAttribute($part);
        }

        if (! empty($parts) && ! is_null($instance)) {
            return $this->getValueFromObject($instance, implode('.', $parts));
        }

        return $instance;
    }
}
