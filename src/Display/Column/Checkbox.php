<?php

namespace SleepingOwl\Admin\Display\Column;

use Form;

class Checkbox extends NamedColumn
{
    /**
     * @var string
     */
    protected $view = 'column.checkbox';

    /**
     * @var string
     */
    protected $width = '30px';

    /**
     * Checkbox constructor.
     *
     * @param  string|null  $label
     */
    public function __construct($label = null)
    {
        parent::__construct($label);
        $this->setLabel(
            Form::checkbox(null, 1, false, ['class' => 'adminCheckboxAll']
        ));
    }

    /**
     * @var bool
     */
    protected $isSearchable = false;

    /**
     * @var bool
     */
    protected $orderable = false;

    /**
     * @return mixed
     */
    public function getModelValue()
    {
        return $this->getModel()->getKey();
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'value' => $this->getModelValue(),
        ];
    }
}
