<?php

namespace SleepingOwl\Admin\Display\Column;

use Illuminate\Support\Collection;

class Lists extends NamedColumn
{
    /**
     * @var string
     */
    protected $view = 'column.lists';

    /**
     * @var bool
     */
    protected $orderable = false;

    /**
     * @var bool
     */
    protected $isSearchable = false;

    /**
     * @var bool
     */
    protected $sortable = false;

    /**
     * @var int
     */
    protected $maxLists = 0;

    /**
     * @param  int  $maxListsItem
     * @return $this
     */
    public function setMaxLists($maxListsItem)
    {
        $this->maxLists = (int) $maxListsItem;

        return $this;
    }

    /**
     * @return int
     */
    public function getMaxLists()
    {
        return $this->maxLists;
    }

    /**
     * @param  bool  $sortable
     * @return $this
     */
    public function setSortable($sortable)
    {
        $this->sortable = (bool) $sortable;

        return $this;
    }

    /**
     * @return bool
     */
    public function isSortable()
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
    public function toArray()
    {
        return parent::toArray() + [
            'values' => $this->getModelValue(),
            'append' => $this->getAppends(),
            'maxLists' => (int) $this->getMaxLists(),
        ];
    }
}
