<?php

namespace SleepingOwl\Admin\Display;

use KodiComponents\Support\HtmlAttributes;
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
     * @return \Illuminate\View\View|string
     */
    public function getView()
    {
        return $this->view;
    }

    /**
     * @param \Illuminate\View\View|string $view
     *
     * @return $this
     */
    public function setView($view)
    {
        $this->view = $view;

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
            'attributes'  => $this->htmlAttributesToString(),
            'title'       => $this->getTitle(),
            'isOrderable' => $this->isOrderable(),
        ];
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        $this->setHtmlAttribute('data-orderable', $this->isOrderable() ? 'true' : 'false');

        return app('sleeping_owl.template')->view($this->getView(), $this->toArray());
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->render();
    }
}
