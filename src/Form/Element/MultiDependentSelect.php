<?php

namespace SleepingOwl\Admin\Form\Element;

use SleepingOwl\Admin\Contracts\Form\Element\HasSyncCallback;
use SleepingOwl\Admin\Contracts\Form\Element\MustDeleteRelatedItem;
use SleepingOwl\Admin\Traits\ElementDeleteRelatedItem;
use SleepingOwl\Admin\Traits\ElementSaveRelation;
use SleepingOwl\Admin\Traits\ElementSyncCallback;

class MultiDependentSelect extends DependentSelect implements HasSyncCallback, MustDeleteRelatedItem
{
    use ElementSaveRelation,
        ElementSyncCallback,
        ElementDeleteRelatedItem;

    /**
     * @return string
     */
    public function getName()
    {
        return parent::getName().'[]';
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $this->setHtmlAttributes([
            'multiple',
        ]);

        return parent::toArray();
    }
}
