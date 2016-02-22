<?php

namespace SleepingOwl\Admin\Display\Column;

class Text extends NamedColumn
{
    /**
     * String constructor.
     *
     * @param $name
     */
    public function __construct($name)
    {
        parent::__construct($name);
        $this->setAttribute('class', 'row-string');
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
