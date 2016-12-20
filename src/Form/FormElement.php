<?php

namespace SleepingOwl\Admin\Form;

use Illuminate\Http\Request;
use SleepingOwl\Admin\Traits\Assets;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\FormElementInterface;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;

abstract class FormElement implements FormElementInterface
{
    use Assets;

    /**
     * @var \SleepingOwl\Admin\Contracts\TemplateInterface
     */
    protected $template;

    /**
     * @var string|\Illuminate\View\View
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

    /**
     * @var ModelConfigurationInterface
     */
    protected $modelConfiguration;

    /**
     * FormElement constructor.
     *
     * @param TemplateInterface $template
     */
    public function __construct(TemplateInterface $template)
    {
        $this->template = $template;
        $this->initializePackage(
            $this->template->meta()
        );
    }

    public function initialize()
    {
        $this->includePackage(
            $this->template->meta()
        );
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

        $this->validationRules = [];
        foreach ($validationRules as $rule) {
            $this->validationRules[] = explode('|', $rule);
        }

        return $this;
    }

    /**
     * @return string|\Illuminate\View\View
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
     * @param \Illuminate\View\View|string $view
     *
     * @return $this
     */
    public function setView($view)
    {
        $this->view = $view;

        return $this;
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
     * @param ModelConfigurationInterface $model
     *
     * @return $this
     */
    public function setModelConfiguration(ModelConfigurationInterface $model)
    {
        $this->modelConfiguration = $model;

        return $this;
    }

    /**
     * @return ModelConfigurationInterface
     */
    public function getModelConfiguration()
    {
        return $this->modelConfiguration;
    }

    /**
     * @param Request $request
     */
    public function save(Request $request)
    {
    }

    /**
     * @param Request $request
     */
    public function afterSave(Request $request)
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
        return $this->template->view($this->getView(), $this->toArray())->render();
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->render();
    }
}
