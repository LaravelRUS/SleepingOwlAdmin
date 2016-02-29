<?php

namespace SleepingOwl\Admin\Display\Column;

class Email extends NamedColumn
{
    /**
     * Email constructor.
     *
     * @param string $name
     */
    public function __construct($name)
    {
        parent::__construct($name);
        $this->setAttribute('class', 'row-email');
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'value'  => $this->getModelValue(),
            'append' => $this->getAppends(),
        ];
    }
}
