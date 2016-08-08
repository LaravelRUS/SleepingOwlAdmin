<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Http\Request;
use KodiCMS\Assets\Package;
use SleepingOwl\Admin\Contracts\TemplateInterface;
use SleepingOwl\Admin\Contracts\Wysiwyg\ManagerInterface;

class CKEditor extends Wysiwyg
{
    /**
     * @param string $path
     * @param string|null $label
     * @param TemplateInterface $template
     * @param Package $package
     * @param Request $request
     * @param ManagerInterface $manager
     */
    public function __construct($path,
                                $label,
                                TemplateInterface $template,
                                Package $package,
                                Request $request,
                                ManagerInterface $manager)
    {
        parent::__construct($path, $label, 'ckeditor', $template, $package, $request, $manager);
    }
}
