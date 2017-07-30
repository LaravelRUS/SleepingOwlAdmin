<?php

namespace SleepingOwl\Admin\Form\Element;

class CKEditor extends Wysiwyg
{
    /**
     * @param string      $path
     * @param string|null $label
     */
    public function __construct($path, $label = null)
    {
        parent::__construct($path, $label, 'ckeditor');
    }

    /**
     * Add Params Editor for Upload files.
     */
    public function initialize()
    {
        parent::initialize();

        $params = collect($this->getParameters());

        if (! $params->has('uploadUrl')) {
            $this->parameters['uploadUrl'] = route('admin.ckeditor.upload');
        }

        if (! $params->has('filebrowserUploadUrl')) {
            $this->parameters['filebrowserUploadUrl'] = route('admin.ckeditor.upload');
        }
    }
}
