<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Validator;
use SleepingOwl\Admin\Display\Column\NamedColumn;

class EditableColumn extends NamedColumn
{
    /**
     * @var bool
     */
    protected $readonlyEditable = false;

    /**
     * @var string
     */
    protected $url = null;

    /**
     * @var string
     */
    protected $title = null;

    /**
     * @var string
     */
    protected $editableMode = 'popup';

    /**
     * @var mixed
     */
    protected $modifier = null;

    /**
     * @var array
     */
    protected $validationRules = [];

    /**
     * @var array
     */
    protected $validationMessages = [];

    /**
     * Text constructor.
     *
     * @param  $name
     * @param  mixed|null  $label
     * @param  mixed|null  $small
     */
    public function __construct($name, $label = null, $small = null)
    {
        parent::__construct($name, $label, $small);

        $this->clearHtmlAttributes();
    }

    /**
     * @return mixed
     */
    public function getModifier()
    {
        return $this->modifier;
    }

    /**
     * @return mixed
     */
    public function getModifierValue()
    {
        if (is_callable($this->modifier)) {
            return call_user_func($this->modifier, $this);
        }

        if (is_null($this->modifier)) {
            return $this->getModelValue();
        }

        return $this->modifier;
    }

    /**
     * @param  $modifier
     * @return $this
     */
    public function setModifier($modifier)
    {
        $this->modifier = $modifier;

        return $this;
    }

    public function getValidationRules(): array
    {
        return $this->validationRules;
    }

    public function addValidationRule($rule, $message = null)
    {
        $this->validationRules[] = $rule;

        if (! is_null($message)) {
            $this->addValidationMessage($rule, $message);
        }

        return $this;
    }

    public function setValidationRules($validationRules)
    {
        if (! is_array($validationRules)) {
            $validationRules = func_get_args();
        }

        $this->validationRules = [];
        foreach ($validationRules as $rule) {
            foreach (is_string($rule) ? explode('|', $rule) : [$rule] as $item) {
                $this->addValidationRule($item);
            }
        }

        return $this;
    }

    public function getValidationMessages(): array
    {
        return $this->validationMessages;
    }

    public function addValidationMessage($rule, $message)
    {
        if (is_string($rule) && ($position = strpos($rule, ':')) !== false) {
            $rule = substr($rule, 0, $position);
        }

        $this->validationMessages[$rule] = $message;

        return $this;
    }

    public function setValidationMessages(array $validationMessages)
    {
        $this->validationMessages = $validationMessages;

        return $this;
    }

    public function required($message = null)
    {
        return $this->addValidationRule('required', $message);
    }

    public function validate(Request $request): void
    {
        if (empty($this->validationRules)) {
            return;
        }

        Validator::make(
            ['value' => $request->input('value')],
            ['value' => $this->validationRules],
            $this->validationMessagesForInput(),
            ['value' => $this->getTitle()]
        )->validate();
    }

    public function isRequired(): bool
    {
        foreach ($this->validationRules as $rule) {
            if (is_string($rule) && explode(':', $rule, 2)[0] === 'required') {
                return true;
            }
        }

        return false;
    }

    private function validationMessagesForInput(): array
    {
        $messages = [];
        $localizedMessages = trans('sleeping_owl::validation');

        if (is_array($localizedMessages)) {
            foreach ($this->validationRules as $rule) {
                if (! is_string($rule)) {
                    continue;
                }

                $ruleName = Str::snake(explode(':', $rule, 2)[0]);
                if (array_key_exists($ruleName, $localizedMessages)) {
                    $messages['value.'.$ruleName] = $localizedMessages[$ruleName];
                }
            }
        }

        foreach ($this->validationMessages as $rule => $message) {
            $messages['value.'.$rule] = $message;
        }

        return $messages;
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        if (isset($this->title)) {
            return $this->title;
        }

        return $this->header->getTitle();
    }

    /**
     * @param  bool  $title
     * @return $this
     */
    public function setTitle(bool $title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Роут подменен.
     * nit:Daan 2023-02-14.
     *
     * @return string
     */
    public function getUrl()
    {
        if (! $this->url) {
            $return = request()->url();
            if (request()->getScheme() != rtrim(URL::formatScheme(), ':/')) {
                $return = preg_replace('~^[^:]+://~isu', URL::formatScheme(), $return);
            }

            return str_replace('/async', '/async-inline', $return);
        }

        return str_replace('/async', '/async-inline', $this->url);
    }

    /**
     * @param  string|null  $url
     * @return $this
     */
    public function setUrl(?string $url)
    {
        $this->url = $url;

        return $this;
    }

    /**
     * @return string
     */
    public function getEditableMode()
    {
        return $this->editableMode;
    }

    /**
     * @param  string|null  $mode
     * @return $this
     */
    public function setEditableMode(?string $mode)
    {
        if (isset($mode) && in_array($mode, ['inline', 'popup'])) {
            $this->editableMode = $mode;
        }

        return $this;
    }

    /**
     * @return bool|callable
     */
    public function isReadonly()
    {
        if (! $this->getModel()) {
            return true;
        }

        // Add policy
        if ($this->getModelConfiguration()->isEditable($this->getModel())) {
            return $this->isColumnReadonly();
        }

        return true;
    }

    public function isColumnReadonly()
    {
        if (is_callable($this->readonlyEditable)) {
            return (bool) call_user_func($this->readonlyEditable, $this->getModel());
        }

        return (bool) $this->readonlyEditable;
    }

    /**
     * @param  Closure|bool  $readonlyEditable
     * @return $this
     */
    public function setReadonly($readonlyEditable)
    {
        $this->readonlyEditable = $readonlyEditable;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'id' => $this->getModel()->getKey(),
            'value' => $this->getModelValue(),
            'isReadonly' => $this->isReadonly(),
            'url' => $this->getUrl(),
            'title' => $this->getTitle(),
            'mode' => $this->getEditableMode(),
            'required' => $this->isRequired(),
            'text' => $this->getModifierValue(),
        ];
    }
}
