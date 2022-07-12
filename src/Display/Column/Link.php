<?php

namespace SleepingOwl\Admin\Display\Column;

class Link extends Url
{
    /**
     * @var string
     */
    protected string $view = 'column.link';

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
    public function toArray(): array
    {
        return parent::toArray() + [
            'link' => $this->getModelConfiguration()->getEditUrl($this->getModel()->getKey()),
            'isEditable' => $this->isEditable(),
        ];
    }
}
