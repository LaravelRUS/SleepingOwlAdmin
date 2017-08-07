<?php

namespace SleepingOwl\Admin\Form\Buttons;

/**
 * Class Cancel.
 */
class Cancel extends FormButton
{
    protected $show = true;
    protected $name = 'cancel';
    protected $iconClass = 'fa-ban';

    public function __construct()
    {
        $this->setText(trans('sleeping_owl::lang.table.cancel'));
    }

    /**
     * Init Cancel Button.
     */
    public function initialize()
    {
        parent::initialize();
        $this->setUrl($this->getModelConfiguration()->getCancelUrl());
    }
}
