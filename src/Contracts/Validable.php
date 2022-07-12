<?php

namespace SleepingOwl\Admin\Contracts;

interface Validable
{
    /**
     * Get form item validation rules.
     *
     * @return array
     */
    public function getValidationRules(): array;

    /**
     * @return array
     */
    public function getValidationMessages(): array;

    /**
     * @return array
     */
    public function getValidationLabels(): array;
}
