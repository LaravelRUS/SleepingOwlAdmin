<?php

namespace SleepingOwl\Admin\Display\Column;

use SleepingOwl\Admin\Display\TableColumn;

class Control extends TableColumn
{
    /**
     * @var string
     */
    protected $view = 'column.control';

    /**
     * @var string
     */
    protected $width = '90px';

    /**
     * @var
     */
    protected $buttons;

    /**
     * Control constructor.
     *
     * @param string|null $label
     */
    public function __construct($label = null)
    {
        parent::__construct($label);
        $this->setOrderable(false);

        $this->setHtmlAttribute('class', 'row-control text-right');
    }

    /**
     * @return mixed
     */
    protected function getModelKey()
    {
        return $this->getModel()->getKey();
    }

    /**
     * Check if instance supports soft-deletes and trashed.
     *
     * @return bool
     */
    protected function isTrashed()
    {
        if (method_exists($this->getModel(), 'trashed')) {
            return $this->getModel()->trashed();
        }

        return false;
    }

    /**
     * Check if instance editable.
     *
     * @return bool
     */
    protected function isEditable()
    {
        return
            ! $this->isTrashed()
            &&
            $this->getModelConfiguration()->isEditable(
                $this->getModel()
            );
    }

    /**
     * Get instance edit url.
     * @return string
     */
    protected function getEditUrl()
    {
        return $this->getModelConfiguration()->getEditUrl($this->getModelKey());
    }

    /**
     * Check if instance is deletable.
     *
     * @return bool
     */
    protected function isDeletable()
    {
        return
            ! $this->isTrashed()
            &&
            $this->getModelConfiguration()->isDeletable(
                $this->getModel()
            );
    }

    /**
     * Get instance delete url.
     *
     * @return string
     */
    protected function getDeleteUrl()
    {
        return $this->getModelConfiguration()->getDeleteUrl($this->getModelKey());
    }

    /**
     * Check if instance is restorable.
     *
     * @return bool
     */
    protected function isRestorable()
    {
        return
            $this->isTrashed()
            &&
            $this->getModelConfiguration()->isRestorable(
                $this->getModel()
            );
    }

    /**
     * Get instance restore url.
     *
     * @return string
     */
    protected function getRestoreUrl()
    {
        return $this->getModelConfiguration()->getRestoreUrl($this->getModelKey());
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'editable'   => $this->isEditable(),
            'editUrl'    => $this->getEditUrl(),
            'deletable'  => $this->isDeletable(),
            'deleteUrl'  => $this->getDeleteUrl(),
            'restorable' => $this->isRestorable(),
            'restoreUrl' => $this->getRestoreUrl(),
        ];
    }
}
