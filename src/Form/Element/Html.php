<?php

namespace SleepingOwl\Admin\Form\Element;

use Closure;
use SleepingOwl\Admin\Contracts\TemplateInterface;

class Html extends Custom
{
    /**
     * Html constructor.
     *
     * @param string|Closure $html
     * @param TemplateInterface $template
     */
    public function __construct($html, TemplateInterface $template)
    {
        $this->setDisplay($html);

        parent::__construct(null, $template);
    }
}
