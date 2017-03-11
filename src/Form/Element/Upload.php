<?php

namespace SleepingOwl\Admin\Form\Element;

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
     * @param \Illuminate\Http\Request $request
     *
     * @return UploadedFile|null
     */
    public function getValueFromRequest(\Illuminate\Http\Request $request)
    {
        return $request->file($this->getPath());
    }

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function save(\Illuminate\Http\Request $request)
    {
        $value = $this->getValueFromRequest($request);

        if ($request->input($this->getPath().'_remove')) {
            $this->setModelAttribute(null);
        } elseif (! is_null($value)) {
            $this->setModelAttribute($value);
        }
    }
}
