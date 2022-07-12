<?php

namespace SleepingOwl\Admin\Display;

use Illuminate\View\View;

class ControlButton extends ControlLink
{
    /**
     * @var string|View
     */
    protected string $view = 'column.control_button';

    /**
     * @var string
     */
    protected string $method = 'post';

    /**
     * @param  string  $method
     * @return $this
     */
    public function setMethod($method): self
    {
        $this->method = $method;

        return $this;
    }

    /**
     * @return string
     */
    public function getMethod(): string
    {
        return $this->method;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return parent::toArray() + [
            'method' => $this->getMethod(),
        ];
    }
}
