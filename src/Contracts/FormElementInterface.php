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
     * @return array
     */
    public function getValidationMessages();

    /**
     * @return array
     */
    public function getValidationLabels();

    /**
     * Save form item.
     */
    public function save();

    /**
     * Save form item.
     */
    public function afterSave();
}
