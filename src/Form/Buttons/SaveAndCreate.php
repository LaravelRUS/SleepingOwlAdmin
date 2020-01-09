<?php

namespace SleepingOwl\Admin\Form\Buttons;

/**
 * Class SaveAndCreate.
 */
class SaveAndCreate extends FormButton
{
    protected $show = true;
    protected $name = 'save_and_create';
    protected $iconClass = 'fas fa-plus-square';

    public function __construct()
    {
        $this->setText(trans('sleeping_owl::lang.button.save_and_create'));
        $this->setHtmlAttributes($this->getHtmlAttributes() + [
            'type' => 'submit',
            'name' => 'next_action',
            'class' => 'btn btn-info',
        ]);
    }

    /**
     * Init SaveAndCreate Button.
     */
    public function initialize()
    {
    }
}
