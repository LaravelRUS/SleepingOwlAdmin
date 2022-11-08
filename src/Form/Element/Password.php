<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Http\Request;

class Password extends NamedFormElement
{
    public function __construct($path, $label = null)
    {
        parent::__construct($path, $label);

        $this->setHtmlAttributes([
            'class' => 'passwd form-control pr-5',
            'type' => 'password',
        ]);
    }

    /**
     * @var bool
     */
    protected $allowEmpty = false;
    protected $canGenerate = false;
    protected $generateLength = 8;

    /**
     * @var string
     */
    protected $view = 'form.element.password';

    /**
     * @param  Request  $request
     * @return void
     */
    public function save(Request $request)
    {
        $value = $this->getValueFromModel();

        if (! $this->isAllowedEmptyValue() && $this->getModel()->exists && empty($value)) {
            return;
        }

        parent::save($request);
    }

    /**
     * Checks if value exists only inside request instance. Otherwise it'll return null, because password hash
     * should not be returned from model and rendered inside forms.
     *
     * @return array|mixed|null|string
     */
    public function getValueFromModel()
    {
        if (($value = $this->getValueFromRequest(request())) !== null) {
            return $value;
        }

        return $this->getDefaultValue();
    }

    /**
     * @return array
     */
    public function getValidationRules()
    {
        $data = parent::getValidationRules();

        if (! $this->isAllowedEmptyValue() && $this->getModel()->exists) {
            foreach ($data as $field => $rules) {
                foreach ($rules as $i => $rule) {
                    if ($rule == 'required') {
                        unset($data[$field][$i]);
                    }
                }
            }
        }

        return $data;
    }

    /**
     * @return bool
     */
    public function isAllowedEmptyValue()
    {
        return $this->allowEmpty;
    }

    /**
     * @return $this
     */
    public function allowEmptyValue()
    {
        $this->allowEmpty = true;

        return $this;
    }

    /**
     * @return $this
     */
    public function hashWithBcrypt()
    {
        return $this->mutateValue(function ($value) {
            return bcrypt($value);
        });
    }

    /**
     * @return $this
     */
    public function hashWithMD5()
    {
        return $this->mutateValue(function ($value) {
            return md5($value);
        });
    }

    /**
     * @return $this
     */
    public function hashWithSHA1()
    {
        return $this->mutateValue(function ($value) {
            return sha1($value);
        });
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return parent::toArray() + [
            'canGenerate' => $this->canGenerate,
            'generateLength' => $this->generateLength,
        ];
    }

    /**
     * Добавляет возможность генерировать пароль.
     * Длина пароля может задаваться параметром.
     *
     * @param  null  $length
     * @return $this
     */
    public function canGenerate($length = null): self
    {
        $this->canGenerate = true;

        if ($length) {
            $this->generateLength = (int) $length;
        }

        return $this;
    }
}
