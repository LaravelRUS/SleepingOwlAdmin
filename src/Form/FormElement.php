<?php

namespace SleepingOwl\Admin\Form;

use Closure;
use Illuminate\Http\Request;
use SleepingOwl\Admin\Traits\Assets;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Traits\Renderable;
use SleepingOwl\Admin\Traits\VisibleCondition;
use SleepingOwl\Admin\Contracts\FormElementInterface;

abstract class FormElement implements FormElementInterface
{
    use Assets, VisibleCondition, Renderable;

    /**
     * @var \SleepingOwl\Admin\Contracts\TemplateInterface
     */
    protected $template;

    /**
     * @var Model
     */
    protected $model;

    /**
     * @var array
     */
    protected $validationRules = [];

    /**
     * @var array
     */
    protected $validationMessages = [];

    /**
     * @var bool
     */
    protected $readonly = false;

    /**
     * @var mixed
     */
    protected $value;

    public function __construct()
    {
        $this->initializePackage();
    }

    public function initialize()
    {
        $this->includePackage();
    }

    /**
     * @return array
     */
    public function getValidationMessages()
    {
        return $this->validationMessages;
    }

    /**
     * @param string $rule
     * @param string $message
     *
     * @return $this
     */
    public function addValidationMessage($rule, $message)
    {
        if (($pos = strpos($rule, ':')) !== false) {
            $rule = substr($rule, 0, $pos);
        }

        $this->validationMessages[$rule] = $message;

        return $this;
    }

    /**
     * @param array $validationMessages
     *
     * @return $this
     */
    public function setValidationMessages(array $validationMessages)
    {
        $this->validationMessages = $validationMessages;

        return $this;
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

        if (is_null($message)) {
            return $this;
        }

        return $this->addValidationMessage($rule, $message);
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
            $rules = explode('|', $rule);

            foreach ($rules as $rule) {
                $this->addValidationRule($rule);
            }
        }

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
     * @return bool
     */
    public function isReadonly()
    {
        if (is_callable($this->readonly)) {
            return (bool) call_user_func($this->readonly, $this->getModel());
        }

        return (bool) $this->readonly;
    }

    /**
     * @param Closure|bool $readonly
     *
     * @return $this
     */
    public function setReadonly($readonly)
    {
        $this->readonly = $readonly;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @param mixed $value
     *
     * @return $this
     */
    public function setValue($value)
    {
        $this->value = $value;

        return $this;
    }

    /**
     * @param Request $request
     *
     * @return void
     */
    public function save(Request $request)
    {
    }

    /**
     * @param Request $request
     *
     * @return void
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
            'value' => $this->getValue(),
            'readonly' => $this->isReadonly(),
            'model' => $this->getModel(),
        ];
    }
}
