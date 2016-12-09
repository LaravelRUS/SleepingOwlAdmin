<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Http\Request;

class Images extends Image
{

    /**
     * Store array of images as json string
     * @return $this
     */
    public function storeAsJson()
    {
        $this->mutateValue(function($value) {
            return json_encode($value);
        });

        return $this;
    }

    /**
     * Store array of images as coma separator
     *
     * @return $this
     */
    public function storeAsComaSeparatedValue()
    {
        $this->mutateValue(function($value) {
            return implode(',', $value);
        });

        return $this;
    }

    /**
     * @param Request $request
     *
     * @return void
     */
    public function save(Request $request)
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
     * @param Request $request
     *
     * @return string
     */
    public function getValue(Request $request)
    {
        $value = parent::getValue($request);
        if (is_null($value)) {
            $value = [];
        }

        if (is_string($value)) {
            $value = preg_split('/,/', $value, -1, PREG_SPLIT_NO_EMPTY);
        }

        return $value;
    }
}
