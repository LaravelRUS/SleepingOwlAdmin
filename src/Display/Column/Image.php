<?php

namespace SleepingOwl\Admin\Display\Column;

class Image extends NamedColumn
{
    /**
     * @var string
     */
    protected $imageWidth = '80px';

    /**
     * Image constructor.
     *
     * {@inheritdoc}
     */
    public function __construct($name, $label = null)
    {
        parent::__construct($name, $label);
        $this->setOrderable(false);
    }

    /**
     * @return string
     */
    public function getImageWidth()
    {
        return $this->imageWidth;
    }

    /**
     * @param string $width
     *
     * @return $this
     */
    public function setImageWidth($width)
    {
        $this->imageWidth = $width;

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
            'imageWidth'  => $this->getImageWidth(),
            'append' => $this->getAppends(),
        ];
    }
}
