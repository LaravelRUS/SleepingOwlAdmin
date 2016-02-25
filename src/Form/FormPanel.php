<?php

namespace SleepingOwl\Admin\Form;

use SleepingOwl\Admin\Contracts\FormElementInterface;

class FormPanel extends FormDefault
{
    /**
     * @var string
     */
    protected $view = 'panel';

    /**
     * Initialize form.
     */
    public function initialize()
    {
        $this->getButtons()->setAttribute('class', 'panel-footer');

        parent::initialize();
    }

    /**
     * @param array|FormElementInterface $items
     *
     * @return $this
     */
    public function addBody($items)
    {
        if (! is_array($items)) {
            $items = func_get_args();
        }

        $this->items[] = $items;

        return $this;
    }
}
