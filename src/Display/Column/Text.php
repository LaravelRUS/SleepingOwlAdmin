<?php

namespace SleepingOwl\Admin\Display\Column;

class Text extends NamedColumn
{
    /**
     * String constructor.
     *
     * {@inheritdoc}
     */
    public function __construct($name, $label = null)
    {
        parent::__construct($name, $label);
        $this->setHtmlAttribute('class', 'row-string');
    }

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
