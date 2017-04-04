<?php


namespace SleepingOwl\Admin\Form\Buttons;

/**
 * Class Save.
 */
class SaveAndCreate extends FormButton
{
    protected $show = true;
    protected $name = 'save_and_create';
    protected $iconClass = 'fa-check';

    public function __construct()
    {
        $this->setText(trans('sleeping_owl::lang.table.save_and_create'));
        $this->setHtmlAttributes([
            'type'  => 'submit',
            'name'  => 'next_action',
            'class' => 'btn btn-info',
        ]);
    }

    /**
     * Init Cancel Button.
     */
    public function initialize()
    {
    }
}
