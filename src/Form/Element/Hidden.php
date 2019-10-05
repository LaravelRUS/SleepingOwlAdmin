<?php

namespace SleepingOwl\Admin\Form\Element;

class Hidden extends NamedFormElement
{
    public function __construct($path, $label = null)
    {
        parent::__construct($path, $label);

        $this->setHtmlAttributes([
            'type' => 'hidden',
        ]);
    }

    /**
     * @var string
     */
    protected $view = 'form.element.hidden';
}
