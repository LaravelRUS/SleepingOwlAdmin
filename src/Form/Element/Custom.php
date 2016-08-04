<?php

namespace SleepingOwl\Admin\Form\Element;

use Closure;
use KodiCMS\Assets\Contracts\MetaInterface;
use KodiCMS\Assets\Contracts\PackageManagerInterface;
use SleepingOwl\Admin\Contracts\TemplateInterface;
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
     * @param Closure|null $callback
     * @param PackageManagerInterface $packageManager
     * @param MetaInterface $meta
     * @param TemplateInterface $template
     */
    public function __construct(Closure $callback = null,
                                PackageManagerInterface $packageManager,
                                MetaInterface $meta,
                                TemplateInterface $template)
    {
        if (! is_null($callback)) {
            $this->setCallback($callback);
        }

        parent::__construct($packageManager, $meta, $template);
    }

    /**
     * @return Closure|string
     */
    public function getDisplay()
    {
        if (is_callable($this->display)) {
            return call_user_func($this->display, $this->getModel());
        }

        return $this->display;
    }

    /**
     * @param Closure|string $display
     *
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
     * @param Closure $callback
     *
     * @return $this
     */
    public function setCallback(Closure $callback)
    {
        $this->callback = $callback;

        return $this;
    }

    /**
     * @return $this|Custom|mixed
     */
    public function render()
    {
        return $this->getDisplay();
    }

    public function save()
    {
        $callback = $this->getCallback();

        if (is_callable($callback)) {
            call_user_func($callback, $this->getModel());
        }
    }
}
