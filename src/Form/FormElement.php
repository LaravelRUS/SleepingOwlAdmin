<?php

namespace SleepingOwl\Admin\Form;

use Illuminate\Database\Eloquent\Model;
use KodiCMS\Assets\Facades\Meta;
use SleepingOwl\Admin\Contracts\FormElementInterface;

abstract class FormElement implements FormElementInterface
{

    /**
     * @var \SleepingOwl\Admin\Contracts\TemplateInterface
     */
    protected $template;

    /**
     * @var \KodiCMS\Assets\Meta
     */
    protected $meta;

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
     * @return array
     */
    public function getValidationRules()
    {
        return $this->validationRules;
    }

    /**
     * @param string $rule
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

        $this->validationRules = [];
        foreach ($validationRules as $rule) {
            $this->validationRules[] = explode('|', $rule);
        }

        return $this;
    }

    /**
     * @return string
     */
    public function getView()
    {
        if (is_null($this->view)) {
            $name = (new \ReflectionClass($this))->getShortName();
            $this->view = 'form.element.'.strtolower($name);
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

    /**
     * SMELLS.
     */
    public function save()
    {
    }

    /**
     * SMELLS.
     */
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
