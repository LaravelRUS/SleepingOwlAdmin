<?php

namespace SleepingOwl\Admin\Traits;

trait Width
{
    /**
     * @var int|array|string
     */
    protected $width;

    /**
     * @param  int|array|string  $width
     * @return $this
     */
    public function setWidth($width)
    {
        $this->width = $width;

        return $this;
    }

    /**
     * @return int|array|string
     */
    public function getWidth()
    {
        return $this->width;
    }
}
