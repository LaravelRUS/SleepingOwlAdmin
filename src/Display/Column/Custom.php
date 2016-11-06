<?php

namespace SleepingOwl\Admin\Display\Column;

use Closure;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Display\TableColumn;

class Custom extends TableColumn
{
    /**
     * Callback to render column contents.
     * @var Closure
     */
    protected $callback;

    /**
     * @var string
     */
    protected $view = 'column.custom';

    /**
     * A field that can be ordered.
     * @var string
     */
    protected $orderField;

    /**
     * Custom constructor.
     *
     * @param null|string $label
     * @param Closure $callback
     */
    public function __construct(Closure $callback = null, $label = null)
    {
        parent::__construct($label);
        if (! is_null($callback)) {
            $this->setCallback($callback);
        }
    }

    /**
     * @return Closure
     */
    public function getCallback()
    {
        return $this->callback;
    }

    /**
     * @param Closure $callback
     *
     * @return $this
     */
    public function setCallback(Closure $callback)
    {
        $this->callback = $callback;

        return $this;
    }

    /**
     * @param string $field
     *
     * @return $this
     */
    public function setOrderField($field)
    {
        $this->orderField = $field;

        return $this;
    }

    /**
     * @return string
     */
    public function getOrderField()
    {
        return $this->orderField;
    }

    /**
     * Get value from callback.
     *
     * @param Model $model
     *
     * @return mixed
     * @throws \Exception
     */
    protected function getValue(Model $model)
    {
        if (! is_callable($callback = $this->getCallback())) {
            throw new \Exception('Invalid custom column callback');
        }

        return call_user_func($callback, $model);
    }

    /**
     * @return array
     * @throws \Exception
     */
    public function toArray()
    {
        return parent::toArray() + [
            'value'  => $this->getValue($this->getModel()),
            'append' => $this->getAppends(),
        ];
    }
}
