<?php

namespace SleepingOwl\Admin\Traits;

trait EditableReadonlyTrait
{
    /**
     * @var bool
     */
    protected $readonlyEditable = false;

    /**
     * @return mixed
     */
    public function getReadonly()
    {
        return $this->getModelConfiguration()->isEditable($this->getModel()) && ! $this->readonlyEditable;
    }

    /**
     * @param Closure|bool $readonlyEditable
     *
     * @return $this
     */
    public function setReadonly($readonlyEditable)
    {
        $this->readonlyEditable = $readonlyEditable;

        return $this;
    }
}
