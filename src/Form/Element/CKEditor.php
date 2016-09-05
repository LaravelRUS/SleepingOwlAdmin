<?php

namespace SleepingOwl\Admin\Form\Element;

class CKEditor extends Wysiwyg
{
    /**
     * @var string
     */
    protected $view = 'form.element.wysiwyg';

    /**
     * @param string      $path
     * @param string|null $label
     */
    public function __construct($path, $label = null)
    {
        parent::__construct($path, $label, 'ckeditor');
    }
}
