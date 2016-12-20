<?php

namespace SleepingOwl\Admin\Display\Column;

class Count extends NamedColumn
{
    /**
     * @var string
     */
    protected $view = 'column.count';

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'value' => count($this->getModelValue()),
        ];
    }
}
