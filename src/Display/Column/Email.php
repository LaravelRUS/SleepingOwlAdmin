<?php

namespace SleepingOwl\Admin\Display\Column;

class Email extends NamedColumn
{
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
