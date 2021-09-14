<?php

namespace SleepingOwl\Admin\Traits;

trait FileSize
{
    use MaxFileSizeTrait;

    /**
     * @var number
     */
    protected $min;

    /**
     * @var number
     */
    protected $max;

    /**
     * @param  int  $size  Max size in kilobytes
     * @return $this
     */
    public function maxSize($size)
    {
        if ((int) $size > (int) $this->getMaxFileSize()) {
            $this->addValidationRule('max:'.(int) $this->getMaxFileSize());
        } else {
            $this->addValidationRule('max:'.(int) $size);
        }

        return $this;
    }

    /**
     * @param  int  $size  Max size in kilobytes
     * @return $this
     */
    public function minSize($size)
    {
        $this->addValidationRule('min:'.(int) $size);

        return $this;
    }
}
