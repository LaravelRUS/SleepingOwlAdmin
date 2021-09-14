<?php

namespace SleepingOwl\Admin\Form;

use SleepingOwl\Admin\Traits\CardControl;

class FormTabbed extends FormDefault
{
    use CardControl;

    /**
     * @var string
     */
    protected $view = 'form.tabbed';

    /**
     * FormTabbed constructor.
     *
     * @param  array  $elements
     */
    public function __construct(array $elements = [])
    {
        parent::__construct($elements);

        $this->setCardClass('card-form-tabbed');
    }

    /**
     * Initialize form.
     */
    public function initialize()
    {
        $this->getButtons()->setHtmlAttribute('class', 'card-footer');

        $this->setHtmlAttribute('class', 'card card-default '.$this->getCardClass());

        parent::initialize();
    }
}
