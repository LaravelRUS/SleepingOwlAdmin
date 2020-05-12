<?php

namespace SleepingOwl\Admin\Form\Buttons;

/**
 * Class Restore.
 */
class Restore extends FormButton
{
    protected $show = true;
    protected $name = 'restore';
    protected $iconClass = 'fas fa-reply';

    public function __construct()
    {
        $this->setText(trans('sleeping_owl::lang.button.restore'));
    }

    /**
     * Init Restore Button.
     */
    public function initialize()
    {
        parent::initialize();

        $this->setHtmlAttributes($this->getHtmlAttributes() + [
            'type' => 'submit',
            'name' => 'next_action',
            'class' => 'btn btn-warning',
            'data-url' => $this->getModelConfiguration()->getRestoreUrl($this->getModel()->getKey()),
            'data-redirect' => $this->getModelConfiguration()->getEditUrl($this->getModel()->getKey()),
        ]);
    }

    /**
     * @return bool
     */
    public function canShow()
    {
        if (is_null($this->getModel()->getKey()) || ! $this->show) {
            return false;
        }

        $this->show = $this->isTrashed() &&
            $this->getModelConfiguration()->isRestorable($this->getModel());
    }
}
