<?php

namespace SleepingOwl\Admin\Filter;

class FilterField extends FilterBase
{
    public function getTitle()
    {
        if (is_null($parent = parent::getTitle())) {
            return $this->getValue();
        }

        return $parent;
    }
}
