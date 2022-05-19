<?php

namespace SleepingOwl\Admin\Form\Element;

use SleepingOwl\Admin\Contracts\Form\Element\HasSyncCallback;
use SleepingOwl\Admin\Contracts\Form\Element\MustDeleteRelatedItem;
use SleepingOwl\Admin\Contracts\Form\Element\Taggabled;
use SleepingOwl\Admin\Traits\ElementDeleteRelatedItem;
use SleepingOwl\Admin\Traits\ElementSaveRelation;
use SleepingOwl\Admin\Traits\ElementSyncCallback;
use SleepingOwl\Admin\Traits\ElementTaggable;

class MultiSelect extends Select implements Taggabled, HasSyncCallback, MustDeleteRelatedItem
{
    use ElementSaveRelation,
        ElementTaggable,
        ElementSyncCallback,
        ElementDeleteRelatedItem;

    /**
     * @var int
     */
    protected $max;

    /**
     * @var string
     */
    protected $view = 'form.element.multiselect';

    /**
     * @return string
     */
    public function getName()
    {
        return parent::getName().'[]';
    }

    /**
     * @return int|null
     */
    public function getMax()
    {
        return $this->max;
    }

    /**
     * @param  int  $max
     * @return $this
     */
    public function setMax(int $max)
    {
        $this->max = $max;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $this->setHtmlAttributes([
            'id' => $this->getId(),
            'class' => 'form-control',
            'multiple',
        ]);

        if ($this->isTaggable()) {
            $this->setHtmlAttribute('class', 'input-taggable');
        }

        if ($this->isReadonly()) {
            $this->setHtmlAttribute('disabled', 'disabled');
        }

        return [
            'max' => $this->getMax(),
            'taggable' => $this->isTaggable(),
            'attributes' => $this->htmlAttributesToString(),
        ] + parent::toArray();
    }
}
