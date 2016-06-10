<?php

namespace SleepingOwl\Admin\Form\Element;

use Closure;

class Html extends Custom
{
    /**
     * Custom constructor.
     *
     * @param string|Closure $html
     */
    public function __construct($html)
    {
        $this->setDisplay($html);

        parent::__construct();
    }
}
