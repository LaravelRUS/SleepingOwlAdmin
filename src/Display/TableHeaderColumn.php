<?php

namespace SleepingOwl\Admin\Display;

use SleepingOwl\Admin\Traits\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Display\TableHeaderColumnInterface;

class TableHeaderColumn implements TableHeaderColumnInterface
{
    use HtmlAttributes;

    /**
     * Header title.
     * @var string
     */
    protected $title;

    /**
     * Is column orderable?
     * @var bool
     */
    protected $orderable = true;

    public function __construct()
    {
        $this->setAttribute('class', 'row-header');
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param string $title
     *
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
     * @param bool $orderable
     *
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
        return [
            'attributes'  => $this->getAttributes(),
            'title'       => $this->getTitle(),
            'isOrderable' => $this->isOrderable(),
        ];
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        $this->setAttribute('data-orderable', $this->isOrderable() ? 'true' : 'false');

        return app('sleeping_owl.template')->view('column.header', $this->toArray());
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->render();
    }
}
