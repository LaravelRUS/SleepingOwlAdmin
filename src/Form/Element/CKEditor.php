<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Http\Request;
use KodiCMS\Assets\Contracts\MetaInterface;
use KodiCMS\Assets\Contracts\PackageManagerInterface;
use SleepingOwl\Admin\Contracts\TemplateInterface;
use SleepingOwl\Admin\Contracts\Wysiwyg\ManagerInterface;

class CKEditor extends Wysiwyg
{
    /**
     * @param string $path
     * @param string|null $label
     * @param PackageManagerInterface $packageManager
     * @param MetaInterface $meta
     * @param TemplateInterface $template
     * @param Request $request
     * @param ManagerInterface $manager
     */
    public function __construct($path,
                                $label = null,
                                PackageManagerInterface $packageManager,
                                MetaInterface $meta,
                                TemplateInterface $template,
                                Request $request,
                                ManagerInterface $manager)
    {
        parent::__construct($path, $label, 'ckeditor', $packageManager, $meta, $template, $request, $manager);
    }
}
