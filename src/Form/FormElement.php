<?php

namespace SleepingOwl\Admin\Form;

use Closure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Dimensions;
use Illuminate\Validation\Rules\Exists;
use Illuminate\Validation\Rules\In;
use Illuminate\Validation\Rules\NotIn;
use Illuminate\Validation\Rules\Unique;
use SleepingOwl\Admin\Contracts\Form\FormElementInterface;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Traits\Assets;
use SleepingOwl\Admin\Traits\Renderable;
use SleepingOwl\Admin\Traits\VisibleCondition;

abstract class FormElement implements FormElementInterface
{
    use Assets, Renderable, VisibleCondition;

    /**
     * @var TemplateInterface
     */
    protected $template;

    /**
     * @var Renderable
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
     * @var array
     */
    protected $validationMessages = [];

    /**
     * @var bool|callable
     */
    protected $readonly = false;

    /**
     * @var bool|callable
     */
    protected $valueSkipped = false;

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
     * @param  string  $rule
     * @param  string  $message
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
     * @param  array  $validationMessages
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
     * @param  string  $rule
     * @param  string|null  $message
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
     * @param  array|string  $validationRules
     * @param  string|\Illuminate\Validation\Rule|\Illuminate\Contracts\Validation\Rule  $rule
     * @return $this
     */
    public function setValidationRules($validationRules)
    {
        if (! is_array($validationRules)) {
            $validationRules = func_get_args();
        }

        $this->validationRules = [];
        foreach ($validationRules as $rule) {
            if ($rule instanceof \Illuminate\Validation\Rule || $rule instanceof \Illuminate\Contracts\Validation\Rule || $rule instanceof Dimensions || $rule instanceof Exists || $rule instanceof In || $rule instanceof NotIn || $rule instanceof Unique) {
                $this->addValidationRule($rule);
            } else {
                $rules = explode('|', $rule);
                foreach ($rules as $addRule) {
                    $this->addValidationRule($addRule);
                }
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
     * @param  Model  $model
     * @return $this
     */
    public function setModel(Model $model)
    {
        $this->model = $model;

        return $this;
    }

    /**
     * @return bool|callable
     */
    public function isReadonly()
    {
        if (is_callable($this->readonly)) {
            return (bool) call_user_func($this->readonly, $this->getModel());
        }

        return (bool) $this->readonly;
    }

    /**
     * @return bool
     */
    public function isValueSkipped()
    {
        if (is_callable($this->valueSkipped)) {
            return (bool) call_user_func($this->valueSkipped, $this->getModel());
        }

        return (bool) $this->valueSkipped;
    }

    /**
     * @param  Closure|bool  $valueSkipped
     * @return $this
     */
    public function setValueSkipped($valueSkipped)
    {
        $this->valueSkipped = $valueSkipped;

        return $this;
    }

    /**
     * @param  Closure|bool  $readonly
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
     * @param  mixed  $value
     * @return $this
     */
    public function setValue($value)
    {
        $this->value = $value;

        return $this;
    }

    /**
     * @param  Request  $request
     * @return void
     */
    public function save(Request $request)
    {
    }

    /**
     * @param  Request  $request
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
            'visibled' => $this->isVisible(),
            'model' => $this->getModel(),
        ];
    }
}
