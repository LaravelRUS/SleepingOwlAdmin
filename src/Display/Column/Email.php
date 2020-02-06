<?php

namespace SleepingOwl\Admin\Display\Column;

class Email extends NamedColumn
{
    /**
     * @var string
     */
    protected $view = 'column.email';

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'value' => $this->getModelValue(),
        ];
    }
}
