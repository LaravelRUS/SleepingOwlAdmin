<?php

namespace SleepingOwl\Admin\Form\Element;

use Closure;
use KodiCMS\Assets\Contracts\MetaInterface;
use KodiCMS\Assets\Contracts\PackageManagerInterface;
use SleepingOwl\Admin\Contracts\TemplateInterface;

class Html extends Custom
{
    /**
     * Custom constructor.
     *
     * @param string|Closure $html
     * @param PackageManagerInterface $packageManager
     * @param MetaInterface $meta
     * @param TemplateInterface $template
     */
    public function __construct($html,
                                PackageManagerInterface $packageManager,
                                MetaInterface $meta,
                                TemplateInterface $template)
    {
        $this->setDisplay($html);

        parent::__construct(null, $packageManager, $meta, $template);
    }
}
