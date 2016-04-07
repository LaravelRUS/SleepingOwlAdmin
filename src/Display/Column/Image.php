<?php

namespace SleepingOwl\Admin\Display\Column;

class Image extends NamedColumn
{
    /**
     * @var string
     */
    protected $width = '80px';

    /**
     * @param null|string $name
     * @param null|string $label
     */
    public function __construct($name, $label = null)
    {
        parent::__construct($name, $label);
        $this->setOrderable(false);

        $this->setHtmlAttribute('class', 'row-image');
    }

    /**
     * @return string
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * @param string $width
     *
     * @return $this
     */
    public function setWidth($width)
    {
        $this->width = $width;

        return $this;
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
            'width'  => $this->getWidth(),
            'append' => $this->getAppends(),
        ];
    }
}
