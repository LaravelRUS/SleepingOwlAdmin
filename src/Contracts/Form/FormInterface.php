<?php

namespace SleepingOwl\Admin\Contracts\Form;

use Illuminate\Validation\ValidationException;
use SleepingOwl\Admin\Exceptions\Form\FormException;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;

interface FormInterface extends FormElementInterface, ElementsInterface
{
    /**
     * @param string $class
     *
     * @return $this
     * @throws FormException
     */
    public function setModelClass($class);

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
     * @param \Illuminate\Http\Request $request
     * @param ModelConfigurationInterface $model
     *
     * @throws ValidationException
     *
     * @return void
     */
    public function validateForm(\Illuminate\Http\Request $request, ModelConfigurationInterface $model = null);

    /**
     * Save model.
     *
     * @param \Illuminate\Http\Request $request
     * @param ModelConfigurationInterface $model
     *
     * @return void
     */
    public function saveForm(\Illuminate\Http\Request $request, ModelConfigurationInterface $model = null);
}
