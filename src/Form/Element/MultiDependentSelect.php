<?php

namespace SleepingOwl\Admin\Form\Element;

use SleepingOwl\Admin\Traits\ElementSaveRelationTrait;

class MultiDependentSelect extends DependentSelect
{
    use ElementSaveRelationTrait;

    /**
     * @return string
     */
    public function getName()
    {
        return parent::getName().'[]';
    }

    /**
     * @return string
     */
    public function getDataUrl()
    {
        return $this->dataUrl ?: route('admin.form.element.dependent-select', [
            'adminModel' => \AdminSection::getModel($this->model)->getAlias(),
            'field' => parent::getName(),
            'id' => $this->model->getKey(),
        ]);
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $this->setHtmlAttributes([
            'id' => $this->getName(),
            'size' => 2,
            'data-select-type' => 'single',
            'data-url' => $this->getDataUrl(),
            'data-depends' => $this->getDataDepends(),
            'class' => 'form-control input-select input-select-dependent',
            'multiple'=>'multiple'
        ]);

        if ($this->isReadonly()) {
            $this->setHtmlAttribute('disabled', 'disabled');
        }

        return [
            'id' => $this->getName(),
            'name' => $this->getName(),
            'path' => $this->getPath(),
            'label' => $this->getLabel(),
            'readonly' => $this->isReadonly(),
            'options' => $this->getOptions(),
            'value' => $this->getValueFromModel(),
            'helpText' => $this->getHelpText(),
            'required' => in_array('required', $this->validationRules),
            'attributes' => $this->getHtmlAttributes(),
        ];
    }

}
