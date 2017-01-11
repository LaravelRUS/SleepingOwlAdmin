<?php

namespace SleepingOwl\Admin\Form\Element;

class Images extends Image
{
    /**
     * @var string
     */
    protected $view = 'form.element.images';

    /**
     * Store array of images as json string.
     * @return $this
     */
    public function storeAsJson()
    {
        $this->mutateValue(function ($value) {
            return json_encode($value);
        });

        return $this;
    }

    /**
     * Store array of images as coma separator.
     *
     * @return $this
     */
    public function storeAsComaSeparatedValue()
    {
        $this->mutateValue(function ($value) {
            return implode(',', $value);
        });

        return $this;
    }

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function save(\Illuminate\Http\Request $request)
    {
        $name = $this->getName();
        $value = $request->input($name, '');

        if (! empty($value)) {
            $value = explode(',', $value);
        } else {
            $value = [];
        }

        $request->merge([$name => $value]);

        parent::save($request);
    }

    /**
     * @return string
     */
    public function getValueFromModel()
    {
        $value = parent::getValueFromModel();
        if (is_null($value)) {
            $value = [];
        }

        if (is_string($value)) {
            $value = preg_split('/,/', $value, -1, PREG_SPLIT_NO_EMPTY);
        }

        return $value;
    }
}
