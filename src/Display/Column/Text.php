<?php

namespace SleepingOwl\Admin\Display\Column;

class Text extends NamedColumn
{
    /**
     * @var string
     */
    protected $view = 'column.text';

    /**
     * @var bool
     */
    protected $isSearchable = true;

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'value'  => $this->getModelValue(),
            'small' => $this->getModelSmallValue(),
        ];
    }
}
