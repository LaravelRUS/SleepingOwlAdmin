<?php

namespace SleepingOwl\Admin\Contracts\Form\Element;

interface MustDeleteRelatedItem
{
    /**
     * @return bool
     */
    public function isDeleteRelatedItem();

    /**
     * @return $this
     */
    public function deleteRelatedItem();
}
