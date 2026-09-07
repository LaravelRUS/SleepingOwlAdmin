<?php

namespace SleepingOwl\Admin\Form\Element;

class Email extends Text
{
    public function __construct($path, $label = null)
    {
        parent::__construct($path, $label);

        $this->setHtmlAttribute('type', 'email');
    }
}
