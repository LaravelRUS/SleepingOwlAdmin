<?php

namespace SleepingOwl\Admin\Display\Column\Concerns;

trait HasListDisplayLimit
{
    protected $maxLists = 0;

    public function setMaxLists($maxListsItem)
    {
        $this->maxLists = max(0, (int) $maxListsItem);

        return $this;
    }

    public function getMaxLists(): int
    {
        return $this->maxLists;
    }
}
