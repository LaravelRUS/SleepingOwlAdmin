<?php

namespace SleepingOwl\Admin\Form\Element;

class Password extends NamedFormElement
{
    /**
     * @var bool
     */
    protected $allowEmpty = false;

    public function save()
    {
        $value = $this->getValue();

        if (! $this->isAllowedEmptyValue() and $this->getModel()->exists() and empty($value)) {
            return;
        }

        parent::save();
    }

    /**
     * @return array
     */
    public function getValidationRules()
    {
        $data = parent::getValidationRules();

        if (! $this->isAllowedEmptyValue() and $this->getModel()->exists()) {
            foreach ($data as $field => $rules) {
                foreach ($rules as $i => $rule) {
                    if ($rule == 'required') {
                        unset($data[$field][$i]);
                    }
                }
            }
        }

        return $data;
    }

    /**
     * @return bool
     */
    public function isAllowedEmptyValue()
    {
        return $this->allowEmpty;
    }

    /**
     * @return $this
     */
    public function allowEmptyValue()
    {
        $this->allowEmpty = true;

        return $this;
    }
}
