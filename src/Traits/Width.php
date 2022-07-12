<?php

namespace SleepingOwl\Admin\Traits;

trait Width
{
    /**
     * @var null|string
     */
    protected ?string $width = null;

    /**
     * @param array|int|string $width
     * @return $this
     */
    public function setWidth(array|int|string $width): self
    {
        $this->width = $width;

        return $this;
    }

    /**
     * @return null|string
     */
    public function getWidth(): ?string
    {
        return $this->width;
    }
}
