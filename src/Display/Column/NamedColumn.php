<?php

namespace SleepingOwl\Admin\Display\Column;

use Closure;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection as SuportCollection;
use SleepingOwl\Admin\Contracts\Display\NamedColumnInterface;
use SleepingOwl\Admin\Contracts\Display\OrderByClauseInterface;
use SleepingOwl\Admin\Display\TableColumn;

abstract class NamedColumn extends TableColumn implements NamedColumnInterface
{
    /**
     * Column field name.
     *
     * @var string|null
     */
    protected ?string $name;

    /**
     * @var bool
     */
    protected bool $orderable = true;

    /**
     * @var bool
     */
    protected bool $isSearchable = true;

    /**
     * NamedColumn constructor.
     *
     * @param $name
     * @param $label string|null
     * @param $small string|Closure|null
     */
    public function __construct($name, string $label = null, $small = null)
    {
        parent::__construct($label);
        $this->setName($name);

        if ($small) {
            $this->setSmall($small);
        }

        $this->setHtmlAttribute('class', 'row-'.strtolower(class_basename(get_called_class())));

        if ($this->orderable) {
            $this->setOrderable();
        }
    }

    /**
     * @return string|null
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * @param string|null $name
     * @return $this
     */
    public function setName(?string $name): NamedColumn
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
     * @param  OrderByClauseInterface|bool  $clause
     * @return TableColumn
     */
    public function setOrderable($clause = true): TableColumn
    {
        if ($clause !== false && ! $clause instanceof OrderByClauseInterface) {
            if (! is_string($clause) && ! $clause instanceof Closure) {
                $clause = $this->getName();
            }
        }

        return parent::setOrderable($clause);
    }

    /**
     * @param $class
     * @return $this
     */
    public function setClass($class): NamedColumn
    {
        $this->setHtmlAttribute('class', $class);

        return $this;
    }

    /**
     * @return $this
     */
    public function nowrap(): NamedColumn
    {
        $this->setClass('text-nowrap');

        return $this;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray(): array
    {
        $model_value_small = $this->getSmall();
        if ($this->isolated) {
            $model_value_small = htmlspecialchars($model_value_small);
        }

        return parent::toArray() + [
            'name' => $this->getName(),
            'small' => $model_value_small,
            'visibled' => $this->getVisibled(),
        ];
    }

    /**
     * Get column value from instance.
     *
     * @param Collection|Model|Closure $instance
     * @param string|null|Closure $name
     * @return mixed
     */
    protected function getValueFromObject($instance, null|string|Closure $name): mixed
    {
        if ($name instanceof Closure) {
            return $name($instance);
        }

        /*
         * Implement json parsing
         */
        if (strpos($name, '.') === false && strpos($name, '->') !== false) {
            $casts = collect($instance->getCasts());
            $jsonParts = collect(explode('->', $name));

            $jsonAttr = $instance->{$jsonParts->first()};

            $cast = $casts->get($jsonParts->first(), false);

            if ($cast == 'object') {
                $jsonAttr = json_decode(json_encode($jsonAttr), true);
            } elseif ($cast != 'array') {
                $jsonAttr = json_decode($jsonAttr);
            }

            return Arr::get($jsonAttr, $jsonParts->slice(1)->implode('.'));
        }

        $parts = explode('.', $name);
        $part = array_shift($parts);

        if ($instance instanceof Collection) {
            $instance = $instance->pluck($part);
        } elseif ($instance instanceof SuportCollection) {
            $instance = $instance->first();
            if ($instance instanceof Collection) {
                $instance = $instance->pluck($part);
            }

            if ($instance === null) {
                $instance = collect();
            }
        } elseif (! is_null($instance)) {
            $instance = $instance->getAttribute($part);
        }

        if (! empty($parts) && ! is_null($instance)) {
            return $this->getValueFromObject($instance, implode('.', $parts));
        }

        return $instance;
    }
}
