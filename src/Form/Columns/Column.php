<?php

namespace SleepingOwl\Admin\Form\Columns;

use SleepingOwl\Admin\Form\FormElements;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Form\Columns\ColumnInterface;

class Column extends FormElements implements ColumnInterface
{
    use HtmlAttributes;

    /**
     * @var int
     */
    protected $width;

    /**
     * @var int
     */
    protected $size = 'col-md-';

    /**
     * @var string
     */
    protected $view = 'form.element.column';

    public function initialize()
    {
        parent::initialize();

        $this->setHtmlAttribute('class', $this->getSize().$this->getWidth());
    }

    /**
     * @param int $width
     *
     * @return $this
     */
    public function setWidth($width)
    {
        $this->width = (int) $width;

        return $this;
    }

    /**
     * @return int
     */
    public function getWidth()
    {
        return (int) $this->width;
    }

    /**
     * @return string
     */
    public function getSize()
    {
        return $this->size;
    }

    /**
     * @param string $size
     *
     * @return $this
     */
    public function setSize($size)
    {
        if (strpos($size, 'col-') === false) {
            $size = 'col-'.$size.'-';
        }

        $this->size = $size;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'width' => $this->getWidth(),
            'elements' => $this->getElements()->onlyVisible(),
            'attributes' => $this->htmlAttributesToString(),
        ];
    }
}
