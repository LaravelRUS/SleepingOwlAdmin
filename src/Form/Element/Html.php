<?php

namespace SleepingOwl\Admin\Form\Element;

use Closure;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Contracts\View\View as ViewContract;

class Html extends Custom
{
    /**
     * @var string
     */
    protected $view = 'form.element.html';

    /**
     * @param  string|Closure|Htmlable|ViewContract  $html
     * @param  Closure  $callback
     */
    public function __construct($html, Closure $callback = null)
    {
        $this->setDisplay($html);

        parent::__construct($callback);
    }
}
