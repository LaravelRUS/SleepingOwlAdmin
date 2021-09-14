<?php

namespace SleepingOwl\Admin\Form\Columns;

use Exception;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Form\Columns\ColumnInterface;
use SleepingOwl\Admin\Form\FormElements;
use SleepingOwl\Admin\Traits\Width;

class Column extends FormElements implements ColumnInterface
{
    use HtmlAttributes, Width;

    /**
     * @var int
     */
    protected $size = 'col-md-';

    /**
     * @var string
     */
    protected $view = 'form.element.column';

    /**
     * @throws \Exception
     */
    public function initialize()
    {
        parent::initialize();

        $this->setHtmlAttribute('class', $this->getClass());
    }

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
        if (strpos($size, 'col-') === false) {
            $size = 'col-'.$size.'-';
        }

        $this->size = $size;

        return $this;
    }

    /**
     * @return string
     *
     * @throws \Exception
     */
    protected function getClass()
    {
        $width = $this->getWidth();
        if (is_numeric($width)) {
            $class = $this->getSize().$width;
        } elseif (is_array($width) && count($width)) {
            $class = implode(' ', $width);
        } elseif (is_string($width)) {
            $class = $width;
        } else {
            throw new Exception('Column width should be integer (numeric), string (for example: col-sm-12 col-md-6) or array (list of the Bootstrap classes)');
        }

        return $class;
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
            'elements' => $this->getElements()->onlyVisible(),
            'attributes' => $this->htmlAttributesToString(),
        ];
    }
}
