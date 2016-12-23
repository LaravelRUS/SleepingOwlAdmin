<?php

namespace SleepingOwl\Admin\Form\Panel;

use SleepingOwl\Admin\Form\FormElements;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Form\PanelInterface;

class Body extends FormElements implements PanelInterface
{
    use HtmlAttributes;

    /**
     * @var string
     */
    protected $view = 'form.panel.element';

    /**
     * @var string
     */
    protected $class = 'panel-body';

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
