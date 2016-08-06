<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Http\Request;
use SleepingOwl\Admin\Contracts\TemplateInterface;
use SleepingOwl\Admin\Contracts\Wysiwyg\ManagerInterface;

class CKEditor extends Wysiwyg
{
    /**
     * @param string $path
     * @param string|null $label
     * @param TemplateInterface $template
     * @param Request $request
     * @param ManagerInterface $manager
     */
    public function __construct($path,
                                $label = null,
                                TemplateInterface $template,
                                Request $request,
                                ManagerInterface $manager)
    {
        parent::__construct($path, $label, 'ckeditor', $template, $request, $manager);
    }
}
