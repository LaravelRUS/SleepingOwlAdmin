<?php

namespace SleepingOwl\Admin\Display;

use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
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
    protected $orderable = false;

    /**
     * @var string|\Illuminate\View\View
     */
    protected $view = 'column.header';

    /**
     * @var TemplateInterface
     */
    protected $template;

    /**
     * TableHeaderColumn constructor.
     *
     * @param TemplateInterface $template
     */
    public function __construct(TemplateInterface $template)
    {
        $this->setHtmlAttribute('class', 'row-header');
        $this->template = $template;
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

        return $this->template->view($this->getView(), $this->toArray())->render();
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->render();
    }
}
