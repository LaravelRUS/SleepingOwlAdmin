<?php

namespace SleepingOwl\Admin\Form\Buttons;

/**
 * Class Delete.
 */
class Delete extends FormButton
{
    protected $show = true;
    protected $name = 'delete';
    protected $iconClass = 'fas fa-times';

    public function __construct()
    {
        $this->setText(trans('sleeping_owl::lang.button.delete'));
    }

    /**
     * Init Delete Button.
     */
    public function initialize()
    {
        parent::initialize();

        $this->setHtmlAttributes($this->getHtmlAttributes() + [
            'name' => 'next_action',
            'class' => 'btn btn-danger btn-delete',
            'data-url' => $this->getModelConfiguration()->getDeleteUrl($this->getModel()->getKey()),
            'data-redirect' => $this->getModelConfiguration()->getDisplayUrl(),
        ]);
    }

    /**
     * Show policy.
     *
     * @return bool
     */
    public function canShow()
    {
        if (is_null($this->getModel()->getKey())) {
            return false;
        }

        $this->show = ! $this->isTrashed() && $this->getModelConfiguration()->isDeletable($this->getModel());

        return parent::canShow();
    }
}
