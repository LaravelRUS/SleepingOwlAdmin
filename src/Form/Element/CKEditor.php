<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Http\Request;
use SleepingOwl\Admin\Contracts\TemplateInterface;
use SleepingOwl\Admin\Contracts\Wysiwyg\ManagerInterface;
use SleepingOwl\Admin\Structures\AssetPackage;

class CKEditor extends Wysiwyg
{
    /**
     * @param string $path
     * @param string|null $label
     * @param TemplateInterface $template
     * @param AssetPackage $assetPackage
     * @param Request $request
     * @param ManagerInterface $manager
     */
    public function __construct($path,
                                $label = null,
                                TemplateInterface $template,
                                AssetPackage $assetPackage,
                                Request $request,
                                ManagerInterface $manager)
    {
        parent::__construct($path, $label, 'ckeditor', $template, $assetPackage, $request, $manager);
    }
}
