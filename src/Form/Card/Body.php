<?php

namespace SleepingOwl\Admin\Form\Card;

use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Form\CardInterface;
use SleepingOwl\Admin\Form\FormElements;

class Body extends FormElements implements CardInterface
{
    use HtmlAttributes;

    /**
     * @var string
     */
    protected string $view = 'form.card.element';

    /**
     * @var string
     */
    protected string $class = 'card-body';

    public function initialize()
    {
        parent::initialize();

        $this->setHtmlAttribute('class', $this->class);
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return parent::toArray() + [
            'elements' => $this->getElements()->onlyVisible(),
            'attributes' => $this->htmlAttributesToString(),
        ];
    }
}
