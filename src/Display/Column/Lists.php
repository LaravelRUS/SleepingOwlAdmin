<?php

namespace SleepingOwl\Admin\Display\Column;

class Lists extends NamedColumn
{

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
