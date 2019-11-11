<?php

namespace SleepingOwl\Admin\Form\Card;

use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Form\PanelInterface;
use SleepingOwl\Admin\Form\FormElements;

class Body extends FormElements implements PanelInterface
{
    use HtmlAttributes;

    /**
     * @var string
     */
    protected $view = 'form.card.element';

    /**
     * @var string
     */
    protected $class = 'card-body';

    public function initialize()
    {
        parent::initialize();

        $this->setHtmlAttribute('class', $this->class);
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'elements' => $this->getElements()->onlyVisible(),
            'attributes' => $this->htmlAttributesToString(),
        ];
    }
}
