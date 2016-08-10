<?php

namespace SleepingOwl\Admin\Display\Column;

use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Contracts\Display\TableHeaderColumnInterface;

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
    public function __construct(AdminInterface $admin, TableHeaderColumnInterface $headerColumn, $name, $label = null)
    {
        parent::__construct($admin, $headerColumn, $name, $label);

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
