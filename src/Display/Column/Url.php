<?php

namespace SleepingOwl\Admin\Display\Column;

class Url extends NamedColumn
{
    /**
     * String constructor.
     *
     * @param $name
     */
    public function __construct($name)
    {
        parent::__construct($name);
        $this->setAttribute('class', 'row-url');
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'url' => $this->getModelValue(),
        ];
    }
}
