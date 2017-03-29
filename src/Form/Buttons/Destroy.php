<?php

namespace SleepingOwl\Admin\Form\Buttons;

/**
 * Class Save.
 */
class Destroy extends FormButton
{
    protected $show = true;
    protected $name = 'destroy';
    protected $iconClass = 'fa-ban';

    public function __construct()
    {
        $this->setText(trans('sleeping_owl::lang.table.destroy'));
    }

    /**
     * Init Cancel Button.
     */
    public function initialize()
    {
        parent::initialize();
        $this->setHtmlAttributes([
            'type'  => 'submit',
            'name'  => 'next_action',
            'class' => 'btn btn-danger',
            'data-url'=>$this->getModelConfiguration()->getDestroyUrl($this->getModel()->getKey()),
            'data-redirect'=>$this->getModelConfiguration()->getDisplayUrl(),
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
