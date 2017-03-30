<?php

namespace SleepingOwl\Admin\Form\Buttons;

/**
 * Class Save.
 */
class Delete extends FormButton
{
    protected $show = true;
    protected $name = 'delete';
    protected $iconClass = 'fa-times';

    public function __construct()
    {
        $this->setText(trans('sleeping_owl::lang.table.delete'));
    }

    /**
     * Init Cancel Button.
     */
    public function initialize()
    {
        parent::initialize();
        $this->setHtmlAttributes([
            'name'          => 'next_action',
            'class'         => 'btn btn-danger btn-delete',
            'data-url'      => $this->getModelConfiguration()->getDeleteUrl($this->getModel()->getKey()),
            'data-redirect' => $this->getModelConfiguration()->getDisplayUrl(),
        ]);
    }

    /**
     * Show policy.
     * @return bool
     */
    public function canShow()
    {
        if (is_null($this->getModel()->getKey()) || ! $this->show) {
            return false;
        }

        $this->show = ! $this->isTrashed() && $this->getModelConfiguration()->isDeletable($this->getModel());
        parent::canShow();
    }
}
