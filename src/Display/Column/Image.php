<?php

namespace SleepingOwl\Admin\Display\Column;

class Image extends NamedColumn
{
    /**
     * @param $name
     */
    public function __construct($name)
    {
        parent::__construct($name);
        $this->setOrderable(false);

        $this->setAttribute('class', 'row-image');
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $value = $this->getModelValue();
        if (! empty($value) && (strpos($value, '://') === false)) {
            $value = asset($value);
        }

        return parent::toArray() + [
            'value'  => $value,
            'append' => $this->getAppends(),
        ];
    }
}
