<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

class Upload extends NamedFormElement
{
    /**
     * @var string
     */
    protected $view = 'form.element.upload';

    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'value' => $this->getModel()->getAttribute($this->getModelAttributeKey()),
        ] + parent::toArray();
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return UploadedFile|null
     */
    public function getValueFromRequest(Request $request)
    {
        return $request->file($this->getNameKey() ?: $this->getPath());
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return void
     */
    public function save(Request $request)
    {
        $value = $this->getValueFromRequest($request);

        if ($request->input($this->getPath().'_remove')) {
            $this->setModelAttribute(null);
        } elseif (! is_null($value)) {
            $this->setModelAttribute($value);
        }
    }
}
