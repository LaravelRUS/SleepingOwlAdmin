<?php

namespace SleepingOwl\Admin\Navigation;

use SleepingOwl\Admin\Traits\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Navigation\BadgeInterface;

class Badge implements BadgeInterface
{
    use HtmlAttributes;

    /**
     * @var string
     */
    protected $value;

    /**
     * Badge constructor.
     *
     * @param null $value
     */
    public function __construct($value = null)
    {
        $this->setValue($value);

        $this->setAttribute('class', 'label pull-right');
    }

    /**
     * @return string
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @param string $value
     *
     * @return $this
     */
    public function setValue($value)
    {
        $this->value = $value;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        if (! $this->hasClass('label-', 'bg-')) {
            $this->setAttribute('class', 'label-primary');
        }

        return [
            'value'      => $this->getValue(),
            'attributes' => $this->getAttributes(),
        ];
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        return app('sleeping_owl.template')->view('_partials.navigation.badge', $this->toArray());
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->render();
    }
}
