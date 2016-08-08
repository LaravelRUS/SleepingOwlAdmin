<?php

namespace SleepingOwl\Admin\Form\Element;

use Closure;
use KodiCMS\Assets\Package;
use SleepingOwl\Admin\Contracts\TemplateInterface;

class Html extends Custom
{
    /**
     * Html constructor.
     *
     * @param string|Closure $html
     * @param TemplateInterface $template
     * @param Package $package
     */
    public function __construct($html, TemplateInterface $template, Package $package)
    {
        $this->setDisplay($html);

        parent::__construct(null, $template, $package);
    }
}
