<?php

namespace SleepingOwl\Admin\Form;

class FormTabbed extends FormDefault
{
    /**
     * @var string
     */
    protected $view = 'form.tabbed';

    /**
     * Initialize form.
     */
    public function initialize()
    {
        $this->getButtons()->setHtmlAttribute('class', 'panel-footer');

        $this->setHtmlAttribute('class', 'panel panel-default');

        parent::initialize();
    }
}
