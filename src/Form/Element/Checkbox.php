<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Http\Request;

class Checkbox extends NamedFormElement
{
    /**
     * @param Request $request
     */
    public function save(Request $request)
    {
        $name = $this->getName();
        if (! $request->has($name)) {
            $request->merge([$name => 0]);
        }

        parent::save($request);
    }
}
