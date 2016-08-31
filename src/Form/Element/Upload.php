<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

class Upload extends NamedFormElement
{
    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'value' => $this->getModel()->getAttribute($this->getAttribute()),
        ] + parent::toArray();
    }

    /**
     * @param Request $request
     *
     * @return UploadedFile|null
     */
    public function getValueFromRequest(Request $request)
    {
        return $request->file($this->getPath());
    }

    public function save(Request $request)
    {
        $value = $this->getValueFromRequest();

        if ($request->input($this->getPath().'_remove')) {
            $this->setValue($this->getModel(), $this->getAttribute(), null);
        } elseif (! is_null($value)) {
            $this->setValue($this->getModel(), $this->getAttribute(), $value);
        }
    }
}
