<?php

namespace SleepingOwl\Admin\Contracts\Form\Element;

interface Taggabled
{
    /**
     * @return bool
     */
    public function isTaggable();

    /**
     * @return $this
     */
    public function taggable();
}
