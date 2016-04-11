<?php

namespace SleepingOwl\Admin\Display\Column;

class Url extends NamedColumn
{
    /**
     * String constructor.
     *
     * @param null|string $name
     * @param null|string $label
     */
    public function __construct($name, $label = null)
    {
        parent::__construct($name, $label);

        $this->setHtmlAttribute('class', 'row-url');
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'url' => $this->getModelValue(),
        ];
    }
}
