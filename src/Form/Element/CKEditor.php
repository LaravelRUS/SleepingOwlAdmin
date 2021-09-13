<?php

namespace SleepingOwl\Admin\Form\Element;

class CKEditor extends Wysiwyg
{
    /**
     * CKEditor constructor.
     *
     * @param $path
     * @param  null  $label
     *
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormElementException
     */
    public function __construct($path, $label = null)
    {
        parent::__construct($path, $label, 'ckeditor');
    }
}
