<?php

namespace SleepingOwl\Admin\Display;

use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Display\TableHeaderColumnInterface;
use SleepingOwl\Admin\Traits\Renderable;

class TableHeaderColumn implements TableHeaderColumnInterface
{
    use HtmlAttributes, Renderable;

    /**
     * Header title.
     *
     * @var string
     */
    protected $title;

    /**
     * Is column orderable?
     *
     * @var bool
     */
    protected $orderable = false;

    /**
     * @var string|\Illuminate\View\View
     */
    protected $view = 'column.header';

    public function __construct()
    {
        $this->setHtmlAttribute('class', 'row-header');
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param  string  $title
     * @return $this
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return bool
     */
    public function isOrderable()
    {
        return $this->orderable;
    }

    /**
     * @param  bool  $orderable
     * @return $this
     */
    public function setOrderable($orderable)
    {
        $this->orderable = (bool) $orderable;

        return $this;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        $this->setHtmlAttribute('data-orderable', $this->isOrderable() ? 'true' : 'false');

        return [
            'attributes' => $this->htmlAttributesToString(),
            'title' => $this->getTitle(),
            'isOrderable' => $this->isOrderable(),
        ];
    }
}
