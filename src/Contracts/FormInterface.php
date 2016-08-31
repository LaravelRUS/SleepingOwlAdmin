<?php

namespace SleepingOwl\Admin\Contracts;

use SleepingOwl\Admin\Contracts\Form\ElementsInterface;

interface FormInterface extends FormElementInterface, ElementsInterface
{
    /**
     * Set form action url.
     *
     * @param string $action
     */
    public function setAction($action);

    /**
     * Set form model instance id.
     *
     * @param int $id
     */
    public function setId($id);

    /**
     * @param ModelConfigurationInterface $model
     *
     * @param \Illuminate\Http\Request $request
     * @param \Illuminate\Contracts\Validation\Factory $validator
     *
     * @return \Illuminate\Contracts\Validation\Validator|null
     */
    public function validateForm(ModelConfigurationInterface $model, \Illuminate\Http\Request $request, \Illuminate\Contracts\Validation\Factory $validator);

    /**
     * Save model.
     *
     * @param ModelConfigurationInterface $model
     * @param \Illuminate\Http\Request $request
     *
     * @return
     */
    public function saveForm(ModelConfigurationInterface $model, \Illuminate\Http\Request $request);
}
