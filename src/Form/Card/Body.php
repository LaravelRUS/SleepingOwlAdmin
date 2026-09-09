<?php

namespace SleepingOwl\Admin\Form\Card;

use SleepingOwl\Admin\Contracts\Form\CardInterface;
use SleepingOwl\Admin\Form\FormElements;
use SleepingOwl\Admin\Support\HtmlAttributes;

class Body extends FormElements implements CardInterface
{
    use HtmlAttributes;

    /**
     * @var string
     */
    protected $view = 'form.card.element';

    /**
     * @var string[]
     */
    protected $themeClasses = ['card-body', 'soa-card-body'];

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'elements' => $this->getElements()->onlyVisible(),
            'attributes' => $this->htmlAttributesToString(),
            'attributesArray' => $this->getHtmlAttributes(),
            'themeClasses' => $this->themeClasses,
        ];
    }
}
