<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Validation\ValidationException;
use SleepingOwl\Admin\Exceptions\Form\FormException;
use SleepingOwl\Admin\Contracts\Form\ElementsInterface;

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
     * @param ModelConfigurationInterface $model
     *
     * @throws ValidationException
     *
     * @return void
     */
    public function validateForm(ModelConfigurationInterface $model);

    /**
     * Save model.
     *
     * @param ModelConfigurationInterface $model
     */
    public function saveForm(ModelConfigurationInterface $model);
}
