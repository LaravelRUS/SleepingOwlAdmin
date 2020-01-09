<?php

namespace SleepingOwl\Admin\Form\Buttons;

/**
 * Class Destroy.
 */
class Destroy extends FormButton
{
    protected $show = true;
    protected $name = 'destroy';
    protected $iconClass = 'fas fa-ban';

    public function __construct()
    {
        $this->setText(trans('sleeping_owl::lang.button.destroy'));
    }

    /**
     * Init Destroy Button.
     */
    public function initialize()
    {
        parent::initialize();
        $this->setHtmlAttributes($this->getHtmlAttributes() + [
            'type' => 'submit',
            'name' => 'next_action',
            'class' => 'btn btn-danger',
            'data-url' => $this->getModelConfiguration()->getDestroyUrl($this->getModel()->getKey()),
            'data-redirect' => $this->getModelConfiguration()->getDisplayUrl(),
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
            $this->getModelConfiguration()->isDestroyable($this->getModel());
    }
}
