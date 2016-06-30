<?php

namespace SleepingOwl\Admin\Contracts;

interface FormInterface
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
     * @return \Illuminate\Contracts\Validation\Validator|null
     */
    public function validate(ModelConfigurationInterface $model);

    /**
     * Save model.
     *
     * @param ModelConfigurationInterface $model
     */
    public function save(ModelConfigurationInterface $model);
}
