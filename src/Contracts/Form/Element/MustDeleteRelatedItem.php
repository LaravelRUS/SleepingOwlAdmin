<?php

namespace SleepingOwl\Admin\Contracts\Form\Element;

interface MustDeleteRelatedItem
{
    /**
     * @return bool
     */
    public function isDeleteRelatedItem(): bool;

    /**
     * @return $this
     */
    public function deleteRelatedItem(): MustDeleteRelatedItem;
}
