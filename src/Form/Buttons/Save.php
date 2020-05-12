<?php

namespace SleepingOwl\Admin\Form\Buttons;

/**
 * Class Save.
 */
class Save extends FormButton
{
    protected $show = true;
    protected $name = 'save_and_continue';
    protected $iconClass = 'fas fa-save';

    public function __construct()
    {
        $this->setText(trans('sleeping_owl::lang.button.save'));

        $this->setHtmlAttributes($this->getHtmlAttributes() + [
            'type' => 'submit',
            'name' => 'next_action',
            'class' => 'btn btn-primary',
        ]);
    }

    /**
     * Init Save Button.
     */
    public function initialize()
    {
    }
}
