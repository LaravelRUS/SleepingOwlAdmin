<?php

namespace SleepingOwl\Admin\Form\Element;

use Closure;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Contracts\View\View as ViewContract;
use Illuminate\Http\Request;
use SleepingOwl\Admin\Form\FormElement;

class Custom extends FormElement
{
    /**
     * @var string|Closure
     */
    protected $display;

    /**
     * @var Closure
     */
    protected $callback;

    /**
     * Custom constructor.
     *
     * @param  Closure|null  $callback
     */
    public function __construct(Closure $callback = null)
    {
        if (! is_null($callback)) {
            $this->setCallback($callback);
        }

        parent::__construct();
    }

    /**
     * @return Closure|mixed|string
     */
    public function getDisplay()
    {
        if (is_callable($this->display)) {
            return call_user_func($this->display, $this->getModel());
        }

        if ($this->display instanceof Htmlable) {
            return $this->display->toHtml();
        }

        if ($this->display instanceof View) {
            return $this->display->with('model', $this->getModel())->render();
        }

        return $this->display;
    }

    /**
     * @param  Closure|string|Htmlable|ViewContract  $display
     * @return $this
     */
    public function setDisplay($display)
    {
        $this->display = $display;

        return $this;
    }

    /**
     * @return Closure
     */
    public function getCallback()
    {
        return $this->callback;
    }

    /**
     * @param  Closure  $callback
     * @return $this
     */
    public function setCallback(Closure $callback)
    {
        $this->callback = $callback;

        return $this;
    }

    /**
     * @return $this|self|mixed
     */
    public function render()
    {
        return $this->getDisplay();
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return void
     */
    public function save(Request $request)
    {
        $callback = $this->getCallback();

        if (is_callable($callback)) {
            call_user_func_array($callback, [$this->getModel(), $request]);
        }
    }
}
