<?php

namespace SleepingOwl\Admin\Display\Column;

class Boolean extends NamedColumn
{
    /**
     * @var string
     */
    protected $view = 'column.boolean';

    /**
     * @var bool
     */
    protected $isSearchable = false;

    /**
     * @var bool
     */
    protected $orderable = false;

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
