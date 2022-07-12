<?php

namespace SleepingOwl\Admin\Form\Element;

class Radio extends Select
{
    /**
     * @var string
     */
    protected string $view = 'form.element.radio';

    public function __construct($path, $label = null, $options = [])
    {
        parent::__construct($path, $label, $options);

        $this->setHtmlAttributes([
            'type' => 'radio',
        ]);
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        $this->removeHtmlAttribute('class');

        return ['htmlStringAttributes' => $this->htmlAttributesToString()] + parent::toArray();
    }
}
