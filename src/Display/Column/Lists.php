<?php

namespace SleepingOwl\Admin\Display\Column;

use Illuminate\Support\Collection;

class Lists extends NamedColumn
{
    /**
     * @var string
     */
    protected string $view = 'column.lists';

    /**
     * @var bool
     */
    protected bool $orderable = false;

    /**
     * @var bool
     */
    protected bool $isSearchable = false;

    /**
     * @var bool
     */
    protected bool $sortable = false;

    /**
     * @var int
     */
    protected int $maxLists = 0;

    /**
     * @param  int  $maxListsItem
     * @return $this
     */
    public function setMaxLists(int $maxListsItem): self
    {
        $this->maxLists = $maxListsItem;

        return $this;
    }

    /**
     * @return int
     */
    public function getMaxLists(): int
    {
        return $this->maxLists;
    }

    /**
     * @param  bool  $sortable
     * @return $this
     */
    public function setSortable(bool $sortable): self
    {
        $this->sortable = (bool) $sortable;

        return $this;
    }

    /**
     * @return bool
     */
    public function isSortable(): bool
    {
        return $this->sortable;
    }

    /**
     * @return mixed
     */
    public function getModelValue()
    {
        $values = parent::getModelValue();

        if ($this->isSortable()) {
            if ($values instanceof Collection) {
                $values = $values->sort();
            } elseif (is_array($values)) {
                asort($values);
            }
        }

        return $values;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return parent::toArray() + [
            'values' => $this->getModelValue(),
            'append' => $this->getAppends(),
            'maxLists' => (int) $this->getMaxLists(),
        ];
    }
}
