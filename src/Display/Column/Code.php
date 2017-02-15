<?php

namespace SleepingOwl\Admin\Display\Column;

class Code extends NamedColumn
{
    /**
     * @var string
     */
    protected $view = 'column.code';

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'value'  => $this->getModelValue(),
        ];
    }
}
