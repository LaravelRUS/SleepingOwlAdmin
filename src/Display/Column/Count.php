<?php

namespace SleepingOwl\Admin\Display\Column;

class Count extends NamedColumn
{
    /**
     * @var string
     */
    protected $view = 'column.count';

    /**
     * Count constructor.
     *
     * @param null|string $name
     * @param null|string $label
     */
    public function __construct($name, $label = null)
    {
        parent::__construct($name, $label);
        $this->setHtmlAttribute('class', 'row-count');
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'value' => count($this->getModelValue()),
            'append' => $this->getAppends(),
        ];
    }
}
