<?php

namespace SleepingOwl\Admin\Display;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Traits\Renderable;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Display\ControlButtonInterface;

class ControlLink implements ControlButtonInterface
{
    use HtmlAttributes, Renderable;

    /**
     * @var Closure
     */
    protected $url;

    /**
     * @var Closure
     */
    protected $attributeCondition;

    /**
     * @var int
     */
    protected $position;

    /**
     * @var string|View
     */
    protected $view = 'column.control_link';

    /**
     * @var string
     */
    protected $text;

    /**
     * @var bool
     */
    protected $hideText = false;

    /**
     * @var string
     */
    protected $icon;

    /**
     * @var Model
     */
    protected $model;

    /**
     * @var Closure
     */
    protected $condition;

    /**
     * @param Closure $url
     * @param string $text
     * @param int $position
     */
    public function __construct(Closure $url, $text, $position = 0)
    {
        $this->url = $url;
        $this->position = (int) $position;
        $this->text = $text;

        $this->setHtmlAttributes([
            'class' => 'btn btn-xs',
            'title' => $this->text,
            'data-toggle' => 'tooltip',
        ]);
    }

    /**
     * @return bool|mixed
     */
    public function isActive()
    {
        return $this->condition ? call_user_func($this->condition, $this->model) : true;
    }

    /**
     * @param Model $model
     * @return $this
     */
    public function getConditionAttributes(Model $model)
    {
        $temp = $this->attributeCondition ? call_user_func($this->attributeCondition, $model) : [];

        if ($temp) {
            foreach ($temp as $key => $value) {
                $this->removeHtmlAttribute($key);
                $this->setHtmlAttribute($key, $value);
            }
        }

        return $this;
    }

    /**
     * @param Closure $condition
     *
     * @return $this
     */
    public function setCondition(Closure $condition)
    {
        $this->condition = $condition;

        return $this;
    }

    /**
     * Set condition attribute.
     * @param Closure $condition
     *
     * @return $this
     */
    public function setAttributeCondition(Closure $condition)
    {
        $this->attributeCondition = $condition;

        return $this;
    }

    /**
     * @return $this
     */
    public function hideText()
    {
        $this->hideText = true;

        return $this;
    }

    /**
     * @return int
     */
    public function getPosition()
    {
        return $this->position;
    }

    /**
     * @param Closure $closure
     *
     * @return $this
     */
    public function setUrl(Closure $closure)
    {
        $this->url = $closure;

        return $this;
    }

    /**
     * @param Model $model
     *
     * @return mixed
     */
    public function getUrl(Model $model)
    {
        return call_user_func($this->url, $model);
    }

    /**
     * @param string $text
     *
     * @return $this
     */
    public function setText($text)
    {
        $this->text = $text;

        return $this;
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
     * @param Model $model
     *
     * @return $this
     */
    public function setModel(Model $model)
    {
        $this->model = $model;

        return $this;
    }

    /**
     * @return Model
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return [
            'attributes' => $this->getConditionAttributes($this->model)->htmlAttributesToString(),
            'url' => $this->getUrl($this->getModel()),
            'position' => $this->getPosition(),
            'text' => $this->text,
            'icon' => $this->getIcon(),
            'hideText' => $this->hideText,
        ];
    }
}
