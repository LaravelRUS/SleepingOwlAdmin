<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Database\Eloquent\Model;

interface FormElementInterface
{
    /**
     * Initialize form item.
     */
    public function initialize();

    /**
     * Set currently rendered instance.
     *
     * @param Model $model
     */
    public function setModel(Model $model);

    /**
     * Get form item validation rules.
     * @return mixed
     */
    public function getValidationRules();

    /**
     * Save form item.
     */
    public function save();
}
