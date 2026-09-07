<?php

namespace SleepingOwl\Admin\Form;

use SleepingOwl\Admin\Traits\CardControl;

class FormTabbed extends FormDefault
{
    use CardControl;

    /**
     * @var string
     */
    protected $view = 'form.tabbed';

    /**
     * FormTabbed constructor.
     *
     * @param  array  $elements
     */
    public function __construct(array $elements = [])
    {
        parent::__construct($elements);

        $this->setCardClass('card-form-tabbed');
    }

    public function toArray()
    {
        return parent::toArray() + [
            'cardClass' => $this->getCardClass(),
        ];
    }

    /**
     * @return array
     */
    protected function getButtonThemeClasses()
    {
        return ['card-footer'];
    }
}
