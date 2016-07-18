<?php

namespace SleepingOwl\Admin\Display\Column;

class Link extends Url
{
    /**
     * Check if instance editable.
     *
     * @return bool
     */
    protected function isEditable()
    {
        return $this->getModelConfiguration()->isEditable($this->getModel());
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'link'           => $this->getModelConfiguration()->getEditUrl($this->getModel()->getKey()),
            'append'         => $this->getAppends(),
            'isEditable'     => $this->isEditable(),
        ];
    }
}
