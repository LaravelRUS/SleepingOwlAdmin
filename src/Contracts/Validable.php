<?php

namespace SleepingOwl\Admin\Contracts;

interface Validable
{
    /**
     * Get form item validation rules.
     *
     * @return array
     */
    public function getValidationRules();

    /**
     * @return array
     */
    public function getValidationMessages();

    /**
     * @return array
     */
    public function getValidationLabels();
}
