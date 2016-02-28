<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;

interface FormElementInterface extends Renderable, Arrayable, Initializable
{
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
