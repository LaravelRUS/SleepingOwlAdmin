<?php

namespace SleepingOwl\Admin\Form\Element;

use Closure;
use SleepingOwl\Admin\Contracts\TemplateInterface;
use SleepingOwl\Admin\Structures\AssetPackage;

class Html extends Custom
{
    /**
     * Html constructor.
     *
     * @param string|Closure $html
     * @param TemplateInterface $template
     * @param AssetPackage $assetPackage
     */
    public function __construct($html, TemplateInterface $template, AssetPackage $assetPackage)
    {
        $this->setDisplay($html);

        parent::__construct(null, $template, $assetPackage);
    }
}
