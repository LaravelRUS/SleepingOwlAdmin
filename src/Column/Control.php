<?php

namespace SleepingOwl\Admin\Column;

class Control extends BaseColumn
{
    /**
     * @var string
     */
    protected $view = 'column.control';

    /**
     * @var string
     */
    protected $width = '50px';

    public function __construct()
    {
        parent::__construct();
        $this->setOrderable(false);

        $this->setAttribute('class', 'row-control');
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
        return ! $this->isTrashed() && ! is_null($this->getModelConfiguration()->fireEdit($this->getModelKey()));
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
        return ! $this->isTrashed() && ! is_null($this->getModelConfiguration()->fireDelete($this->getModelKey()));
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
        return $this->isTrashed() && ! is_null($this->getModelConfiguration()->fireRestore($this->getModelKey()));
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
