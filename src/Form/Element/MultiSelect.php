<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Database\Eloquent\Collection;
use SleepingOwl\Admin\Traits\ElementSaveRelationTrait;

class MultiSelect extends Select
{
    use ElementSaveRelationTrait;
    /**
     * @var bool
     */
    protected $taggable = false;

    /**
     * @var \Closure
     */
    protected $syncCallback;

    /**
     * @var bool
     */
    protected $deleteRelatedItem = false;

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
     * @return array|string
     */
    public function getValueFromModel()
    {
        $value = parent::getValueFromModel();

        if (is_array($value)) {
            foreach ($value as $key => $val) {
                $value[$key] = $val;
            }
        }

        if ($value instanceof Collection && $value->count() > 0) {
            $value = $value->pluck($value->first()->getKeyName())->all();
        }

        if ($value instanceof Collection) {
            $value = $value->toArray();
        }

        return $value;
    }

    /**
     * @return bool
     */
    public function isTaggable()
    {
        return $this->taggable;
    }

    /**
     * @return $this
     */
    public function taggable()
    {
        $this->taggable = true;

        return $this;
    }

    /**
     * @return bool
     */
    public function isDeleteRelatedItem()
    {
        return $this->deleteRelatedItem;
    }

    /**
     * @return $this
     */
    public function deleteRelatedItem()
    {
        $this->deleteRelatedItem = true;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $this->setHtmlAttributes([
            'id'    => $this->getName(),
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
                'tagable'    => $this->isTaggable(),
                'attributes' => $this->htmlAttributesToString(),
            ] + parent::toArray();
    }
}
