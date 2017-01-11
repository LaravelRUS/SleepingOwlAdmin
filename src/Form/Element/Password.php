<?php

namespace SleepingOwl\Admin\Form\Element;

class Password extends NamedFormElement
{
    /**
     * @var bool
     */
    protected $allowEmpty = false;

    /**
     * @var string
     */
    protected $view = 'form.element.password';

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function save(\Illuminate\Http\Request $request)
    {
        $value = $this->getValueFromModel();

        if (! $this->isAllowedEmptyValue() and $this->getModel()->exists() and empty($value)) {
            return;
        }

        parent::save($request);
    }

    /**
     * @return array
     */
    public function getValidationRules()
    {
        $data = parent::getValidationRules();

        if (! $this->isAllowedEmptyValue() and $this->getModel()->exists()) {
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
}
