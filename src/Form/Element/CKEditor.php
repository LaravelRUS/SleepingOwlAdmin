<?php

namespace SleepingOwl\Admin\Form\Element;

use SleepingOwl\Admin\Exceptions\Form\FormElementException;

class CKEditor extends Wysiwyg
{
    /**
     * CKEditor constructor.
     *
     * @param $path
     * @param  null  $label
     *
     * @throws FormElementException
     */
    public function __construct($path, $label = null)
    {
        parent::__construct($path, $label, 'ckeditor');
    }
}
