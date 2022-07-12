<?php

namespace SleepingOwl\Admin\Traits;

use SleepingOwl\Admin\Contracts\Form\Element\MustDeleteRelatedItem;

trait ElementDeleteRelatedItem
{
    /**
     * @var bool|null
     */
    protected ?bool $deleteRelatedItem = false;

    /**
     * @return bool
     */
    public function isDeleteRelatedItem(): bool
    {
        return $this->deleteRelatedItem;
    }

    /**
     * @return MustDeleteRelatedItem
     */
    public function deleteRelatedItem(): MustDeleteRelatedItem
    {
        $this->deleteRelatedItem = true;

        return $this;
    }
}
