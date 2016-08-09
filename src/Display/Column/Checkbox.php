<?php

namespace SleepingOwl\Admin\Display\Column;

use Form;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Display\TableColumn;

class Checkbox extends TableColumn
{
    /**
     * @var string
     */
    protected $view = 'column.checkbox';

    /**
     * Checkbox constructor.
     *
     * @param TemplateInterface $template
     * @param string|null $label
     */
    public function __construct(TemplateInterface $template, $label = null)
    {
        parent::__construct($template, $label);
        $this->setLabel(
            Form::checkbox(null, 1, false, ['class' => 'adminCheckboxAll']
        ));

        $this->setOrderable(false);
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'value' => $this->getModel()->getKey(),
        ];
    }
}
