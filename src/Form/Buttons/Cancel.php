<?php

namespace SleepingOwl\Admin\Form\Buttons;

/**
 * Class Cancel.
 */
class Cancel extends FormButton
{
    protected $show = true;
    protected $name = 'cancel';
    protected $iconClass = 'fas fa-ban';

    public function __construct()
    {
        $this->setText(trans('sleeping_owl::lang.button.cancel'));
    }

    /**
     * Init Cancel Button.
     */
    public function initialize()
    {
        parent::initialize();

        $this->setUrl($this->getModelConfiguration()->getCancelUrl());
        $this->setHtmlAttributes($this->getHtmlAttributes() + [
            'class' => 'btn btn-warning',
        ]);
    }
}
