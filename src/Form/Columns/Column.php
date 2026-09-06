<?php

namespace SleepingOwl\Admin\Form\Columns;

use SleepingOwl\Admin\Contracts\Form\Columns\ColumnInterface;
use SleepingOwl\Admin\Form\FormElements;
use SleepingOwl\Admin\Support\HtmlAttributes;
use SleepingOwl\Admin\Traits\Width;

class Column extends FormElements implements ColumnInterface
{
    use HtmlAttributes, Width;

    /**
     * @var int
     */
    protected $size;

    /**
     * @var string
     */
    protected $view = 'form.element.column';

    /**
     * @return string
     */
    public function getSize()
    {
        return $this->size;
    }

    /**
     * @param  string  $size
     * @return $this
     */
    public function setSize($size)
    {
        $this->size = $size;

        return $this;
    }

    /**
     * @return array
     *
     * @throws \Exception
     */
    public function toArray()
    {
        return parent::toArray() + [
            'width' => $this->getWidth(),
            'size' => $this->getSize(),
            'elements' => $this->getElements()->onlyVisible(),
            'attributes' => $this->htmlAttributesToString(),
            'attributesArray' => $this->getHtmlAttributes(),
        ];
    }
}
