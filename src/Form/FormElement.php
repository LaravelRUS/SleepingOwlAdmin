<?php

namespace SleepingOwl\Admin\Form;

use Meta;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\FormElementInterface;

abstract class FormElement implements FormElementInterface
{
    /**
     * @var string
     */
    protected $view;

    /**
     * @var Model
     */
    protected $model;

    /**
     * @var array
     */
    protected $validationRules = [];

    public function initialize()
    {
        Meta::loadPackage(get_called_class());
    }

    /**
     * @return array
     */
    public function getValidationRules()
    {
        return $this->validationRules;
    }

    /**
     * @return array
     */
    public function getValidationMessages()
    {
        return [];
    }

    /**
     * @return array
     */
    public function getValidationLabels()
    {
        return [];
    }

    /**
     * @param string      $rule
     * @param string|null $message
     *
     * @return $this
     */
    public function addValidationRule($rule, $message = null)
    {
        $this->validationRules[] = $rule;

        return $this;
    }

    /**
     * @param array|string $validationRules
     *
     * @return $this
     */
    public function setValidationRules($validationRules)
    {
        if (! is_array($validationRules)) {
            $validationRules = func_get_args();
        }
        foreach ($validationRules as $rule) {
            $validationRules[] = explode('|', $rule);
        }
        $this->validationRules = $validationRules;

        return $this;
    }

    /**
     * @return string
     */
    public function getView()
    {
        if (is_null($this->view)) {
            $reflect = new \ReflectionClass($this);
            $this->view = 'form.element.'.strtolower($reflect->getShortName());
        }

        return $this->view;
    }

    /**
     * @return Model
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * @param Model $model
     *
     * @return $this
     */
    public function setModel(Model $model)
    {
        $this->model = $model;

        return $this;
    }

    public function save()
    {
    }

    public function afterSave()
    {
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'model' => $this->getModel(),
        ];
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        return app('sleeping_owl.template')
            ->view($this->getView(), $this->toArray())
            ->render();
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->render();
    }
}
