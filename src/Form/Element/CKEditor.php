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
}
