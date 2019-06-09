<?php

namespace SleepingOwl\Admin\Traits;

trait ElementDeleteRelatedItem
{
    /**
     * @var bool
     */
    protected $deleteRelatedItem = false;

    /**
     * @return bool
     */
    public function isDeleteRelatedItem()
    {
        return $this->deleteRelatedItem;
    }

    /**
     * @return $this
     */
    public function deleteRelatedItem()
    {
        $this->deleteRelatedItem = true;

        return $this;
    }
}
