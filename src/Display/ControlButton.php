<?php

namespace SleepingOwl\Admin\Display;

use Illuminate\View\View;

class ControlButton extends ControlLink
{
    /**
     * @var string|View
     */
    protected $view = 'column.control_button';

    /**
     * @var string
     */
    protected $method = 'post';

    /**
     * @param  string  $method
     * @return $this
     */
    public function setMethod($method)
    {
        $this->method = $method;

        return $this;
    }

    /**
     * @return string
     */
    public function getMethod()
    {
        return $this->method;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'method' => $this->getMethod(),
        ];
    }
}
