<?php

namespace SleepingOwl\Admin\Form;

use SleepingOwl\Admin\Traits\PanelControl;

class FormTabbed extends FormDefault
{
    use PanelControl;

    /**
     * @var string
     */
    protected $view = 'form.tabbed';

    /**
     * FormTabbed constructor.
     *
     * @param array $elements
     */
    public function __construct(array $elements = [])
    {
        parent::__construct($elements);

        $this->setPanelClass('panel-form-tabbed');
    }

    /**
     * Initialize form.
     */
    public function initialize()
    {
        $this->getButtons()->setHtmlAttribute('class', 'panel-footer');

        $this->setHtmlAttribute('class', 'panel panel-default '.$this->getPanelClass());

        parent::initialize();
    }
}
