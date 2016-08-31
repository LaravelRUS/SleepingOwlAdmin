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
     * @return Model $model
     */
    public function getModel();

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
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function save(\Illuminate\Http\Request $request);

    /**
     * Save form item.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function afterSave(\Illuminate\Http\Request $request);
}
