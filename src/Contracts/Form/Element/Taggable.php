<?php

namespace SleepingOwl\Admin\Contracts\Form\Element;

interface Taggable
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
