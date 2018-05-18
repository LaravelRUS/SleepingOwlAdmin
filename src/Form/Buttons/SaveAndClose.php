<?php

namespace SleepingOwl\Admin\Form\Buttons;

/**
 * Class SaveAndClose.
 */
class SaveAndClose extends FormButton
{
    protected $show = true;
    protected $name = 'save_and_close';
    protected $iconClass = 'fa-check';

    public function __construct()
    {
        $this->setText(trans('sleeping_owl::lang.table.save_and_close'));
        $this->setHtmlAttributes($this->getHtmlAttributes() + [
            'type'  => 'submit',
            'name'  => 'next_action',
            'class' => 'btn btn-success',
        ]);
    }

    /**
     * Init SaveAndClose Button.
     */
    public function initialize()
    {
    }
}
