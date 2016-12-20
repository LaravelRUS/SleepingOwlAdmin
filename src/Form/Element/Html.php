<?php

namespace SleepingOwl\Admin\Form\Element;

use Closure;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;

class Html extends Custom
{
    /**
     * Custom constructor.
     *
     * @param TemplateInterface $template
     * @param string|Closure $html
     */
    public function __construct(TemplateInterface $template, $html)
    {
        $this->setDisplay($html);

        parent::__construct($template);
    }
}
