<?php

namespace SleepingOwl\Admin\Display;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Model;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Display\ControlButtonInterface;
use SleepingOwl\Admin\Traits\Renderable;

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
    protected $class = 'btn btn-xs';

    /**
     * @var Closure|string
     */
    protected $text;

    /**
     * @var Closure|string
     */
    protected $image;

    /**
     * @var Closure|string
     */
    protected $title;

    /**
     * @var bool
     */
    protected $hideText = false;

    /**
     * @var bool
     */
    protected $hideTitle = false;

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
     * @param  Closure  $url
     * @param  Closure|string  $text
     * @param  int  $position
     * @param  string  $title
     * @param  string  $class
     */
    public function __construct(Closure $url, $text, $position = 0, $title = null, $class = null)
    {
        $this->url = $url;
        $this->position = (int) $position;
        $this->text = $text;

        if ($title !== null) {
            $this->setTitle($title);
        }

        if ($class !== null) {
            $this->setClass($class);
        }
    }

    /**
     * @return bool|mixed
     */
    public function isActive()
    {
        return $this->condition ? call_user_func($this->condition, $this->model) : true;
    }

    /**
     * @param  Model  $model
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
     * @param  Closure  $condition
     * @return $this
     */
    public function setCondition(Closure $condition)
    {
        $this->condition = $condition;

        return $this;
    }

    /**
     * Set condition attribute.
     *
     * @param  Closure  $condition
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
     * @return $this
     */
    public function hideTitle()
    {
        $this->hideTitle = true;

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
     * @param  Closure  $closure
     * @return $this
     */
    public function setUrl(Closure $closure)
    {
        $this->url = $closure;

        return $this;
    }

    /**
     * @param  Model  $model
     * @return mixed
     */
    public function getUrl(Model $model)
    {
        return call_user_func($this->url, $model);
    }

    /**
     * @param  Model|null  $model
     * @return mixed
     */
    public function getText($model = null)
    {
        $text = (is_callable($this->text) && is_object($model)) ? call_user_func($this->text, $model) : $this->text;

        $title = null;
        if (is_callable($this->title) && is_object($model)) {
            $title = call_user_func($this->title, $model);
        } elseif ($this->title !== null) {
            $title = $this->title;
        } else {
            $title = $text;
        }

        if (! $this->hideTitle) {
            $this->setHtmlAttributes([
                'title' => $title,
                'data-toggle' => 'tooltip',
            ]);
        }

        $this->setHtmlAttributes([
            'class' => $this->class,
        ]);

        return $text;
    }

    /**
     * @param  Closure|string  $text
     * @return $this
     */
    public function setText($text)
    {
        $this->text = $text;

        return $this;
    }

    /**
     * @param  Closure|string  $title
     * @return $this
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return string
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * @param  Closure|string  $image
     * @return $this
     */
    public function setImage($image)
    {
        $this->image = $image;

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
     * @param  string  $icon
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
    public function getClass()
    {
        return $this->class;
    }

    /**
     * @param  string  $class
     * @return $this
     */
    public function setClass($class)
    {
        $this->class = $class;

        return $this;
    }

    /**
     * @param  Model  $model
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
            'text' => $this->getText($this->getModel()),
            'attributes' => $this->getConditionAttributes($this->model)->htmlAttributesToString(),
            'url' => $this->getUrl($this->getModel()),
            'position' => $this->getPosition(),
            'icon' => $this->getIcon(),
            'image' => $this->getImage(),
            'hideText' => $this->hideText,
        ];
    }
}
