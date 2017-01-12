<?php

namespace SleepingOwl\Admin\Display\Column;

use Illuminate\Support\Collection;

class Count extends NamedColumn
{
    /**
     * @var string
     */
    protected $view = 'column.count';

    /**
     * @return integer
     */
    public function getModelValue()
    {
        $value = parent::getModelValue();

        if (is_array($value) || $value instanceof Collection) {
            return count($value);
        }

        return 0;
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
