<?php

namespace SleepingOwl\Admin\Display\Column;

class Lists extends NamedColumn
{
    /**
     * Lists constructor.
     *
     * {@inheritdoc}
     */
    public function __construct($name, $label = null)
    {
        parent::__construct($name, $label);
        $this->setHtmlAttribute('class', 'row-lists');
    }

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
