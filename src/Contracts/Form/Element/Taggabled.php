<?php

namespace SleepingOwl\Admin\Contracts\Form\Element;

interface Taggabled
{
    /**
     * @return bool
     */
    public function isTaggable(): bool;

    /**
     * @return $this
     */
    public function taggable(): Taggabled;
}
