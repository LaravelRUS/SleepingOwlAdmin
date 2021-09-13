<?php

namespace SleepingOwl\Admin\Display\Column;

use Closure;
use Exception;

class Custom extends NamedColumn
{
    /**
     * Callback to render column contents.
     *
     * @var Closure
     */
    protected $callback;

    /**
     * @var string
     */
    protected $view = 'column.custom';

    /**
     * @var bool
     */
    protected $orderable = false;

    /**
     * @var bool
     */
    protected $isSearchable = false;

    /**
     * Custom constructor.
     *
     * @param  null|string  $label
     * @param  null|string  $small
     * @param  Closure  $callback
     */
    public function __construct($label = null, Closure $callback = null, $small = null)
    {
        parent::__construct($label);
        if (! is_null($label)) {
            $this->setLabel($label);
        }
        if (! is_null($callback)) {
            $this->setCallback($callback);
        }
        if (! is_null($small)) {
            $this->setSmall($small);
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
     * @param  Closure  $callback
     * @return $this
     */
    public function setCallback(Closure $callback)
    {
        $this->callback = $callback;

        return $this;
    }

    /**
     * Get value from callback.
     *
     * @return mixed
     *
     * @throws \Exception
     */
    public function getModelValue()
    {
        if (! is_callable($callback = $this->getCallback())) {
            throw new Exception('Invalid custom column callback');
        }

        return call_user_func($callback, $this->getModel());
    }

    /**
     * @return array
     *
     * @throws \Exception
     */
    public function toArray()
    {
        return parent::toArray() + [
            'value' => $this->getModelValue(),
        ];
    }
}
