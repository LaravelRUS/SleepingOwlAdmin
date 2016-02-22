<?php

namespace SleepingOwl\Admin\Display\Column;

class Count extends NamedColumn
{
    /**
     * @var string
     */
    protected $view = 'column.count';

    public function __construct($name)
    {
        parent::__construct($name);
        $this->setAttribute('class', 'row-count');
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'value'  => count($this->getModelValue()),
            'append' => $this->getAppends(),
        ];
    }
}
