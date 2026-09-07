<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

class Number extends Text
{
    public function initialize()
    {
        parent::initialize();

        $this->setHtmlAttribute('type', 'number');
    }
}
