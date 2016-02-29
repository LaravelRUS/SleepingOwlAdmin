<?php

namespace SleepingOwl\Admin\Display\Column;

use Closure;
use SleepingOwl\Admin\Contracts\ColumnActionInterface;

class Action extends NamedColumn implements ColumnActionInterface
{
    /**
     * Action icon class.
     * @var string
     */
    protected $icon;

    /**
     * Action button style ('long' or 'short').
     * @var string
     */
    protected $style = 'long';

    /**
     * Button submit action.
     * @var Closure
     */
    protected $callback;

    /**
     * Action button target ('_self', '_blank' or any else).
     * @var string
     */
    protected $target = '_self';

    /**
     * Action button value (button label).
     * @var string
     */
    protected $value;

    /**
     * Action button url.
     * @var string
     */
    protected $url;

    /**
     * @var string
     */
    protected $view = 'column.action';

    /**
     * @param string $name
     */
    public function __construct($name)
    {
        parent::__construct($name);
        $this->setOrderable(false);

        $this->setAttribute('class', 'row-action');
    }

    /**
     * @return string
     */
    public function getIcon()
    {
        return $this->icon;
    }

    /**
     * @param string $icon
     *
     * @return $this
     */
    public function setIcon($icon)
    {
        $this->icon = $icon;

        return $this;
    }

    /**
     * @return string
     */
    public function getStyle()
    {
        return $this->style;
    }

    /**
     * @param string $style
     *
     * @return $this
     */
    public function setStyle($style)
    {
        $this->style = $style;

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
     */
    public function setCallback(Closure $callback)
    {
        $this->callback = $callback;
    }

    /**
     * @return string
     */
    public function getTarget()
    {
        return $this->target;
    }

    /**
     * @param string $target
     *
     * @return $this
     */
    public function setTarget($target)
    {
        $this->target = $target;

        return $this;
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
        return parent::toArray() + [
            'icon'   => $this->icon(),
            'style'  => $this->style(),
            'value'  => $this->value(),
            'target' => $this->target(),
            'url'    => $this->url(),
        ];
    }

    /**
     * @return string
     */
    public function getUrl()
    {
        if (! is_null($this->url)) {
            if (is_callable($this->url)) {
                return call_user_func($this->url, $this->getModel());
            }

            if (! is_null($this->getModel())) {
                return strtr($this->url, [':id' => $this->getModel()->getKey()]);
            }

            return $this->url;
        }

        return $this->getModelConfiguration()->getDisplayUrl([
            '_action' => $this->getName(),
            '_id'     => $this->getModel()->getKey(),
        ]);
    }

    /**
     * @param string $url
     *
     * @return $this
     */
    public function setUrl($url)
    {
        $this->url = $url;

        return $this;
    }

    /**
     * Call action button callback.
     *
     * @param $instance
     */
    public function call($instance)
    {
        call_user_func($this->getCallback(), $instance);
    }
}
