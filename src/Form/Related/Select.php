<?php

namespace SleepingOwl\Admin\Form\Related;

class Select extends \SleepingOwl\Admin\Form\Element\Select
{
    public function getValidationRules()
    {
        $rules = parent::getValidationRules();
        $result = [];
        foreach ($rules as $name => $rule) {
            $result[$this->getName()] = $rule;
        }

        return $result;
    }
}
