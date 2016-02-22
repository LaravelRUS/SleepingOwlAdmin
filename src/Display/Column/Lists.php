<?php

namespace SleepingOwl\Admin\Display\Column;

class Lists extends NamedColumn
{
    /**
     * @param $name
     */
    public function __construct($name)
    {
        parent::__construct($name);
        $this->setAttribute('class', 'row-lists');
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'values' => $this->getModelValue(),
            'append' => $this->getAppends(),
        ];
    }
}
