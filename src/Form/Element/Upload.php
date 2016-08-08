<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Http\UploadedFile;
use Request;

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
     * @return UploadedFile|null|array
     */
    public function getValue()
    {
        return $this->request->file($this->getPath());
    }

    public function save()
    {
        $value = $this->getValue();

        if ($this->request->input($this->getPath().'_remove')) {
            $this->setValue($this->getModel(), $this->getAttribute(), null);
        } elseif (! is_null($value)) {
            $this->setValue($this->getModel(), $this->getAttribute(), $value);
        }
    }
}
