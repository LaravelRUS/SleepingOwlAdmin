<?php

namespace SleepingOwl\Admin\Traits;

use SleepingOwl\Admin\Contracts\Form\Element\Taggabled;

trait ElementTaggable
{
    /**
     * @var bool
     */
    protected bool $taggable = false;

    /**
     * @return bool
     */
    public function isTaggable(): bool
    {
        return $this->taggable;
    }

    /**
     * @return $this
     */
    public function taggable(): Taggabled
    {
        $this->taggable = true;

        return $this;
    }
}
