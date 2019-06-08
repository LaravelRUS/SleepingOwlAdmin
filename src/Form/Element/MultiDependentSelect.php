<?php

namespace SleepingOwl\Admin\Form\Element;

use SleepingOwl\Admin\Contracts\Form\Element\MustDeleteRelatedItem;
use SleepingOwl\Admin\Contracts\Form\Element\HasSyncCallback;
use SleepingOwl\Admin\Contracts\Form\Element\Taggable;
use SleepingOwl\Admin\Traits\ElementDeleteRelatedItem;
use SleepingOwl\Admin\Traits\ElementSaveRelation;
use SleepingOwl\Admin\Traits\ElementSyncCallback;
use SleepingOwl\Admin\Traits\ElementTaggable;

class MultiDependentSelect extends DependentSelect implements Taggable, HasSyncCallback, MustDeleteRelatedItem
{
    use ElementSaveRelation,
        ElementTaggable,
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

        if ($this->isTaggable()) {
            $this->setHtmlAttribute('class', 'input-taggable');
        }

        return [
                'taggable'    => $this->isTaggable(),
                'attributes' => $this->htmlAttributesToString(),
            ] + parent::toArray();
    }
}
