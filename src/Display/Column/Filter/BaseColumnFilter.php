<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

use KodiComponents\Support\HtmlAttributes;
use Meta;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Traits\Assets;
use SleepingOwl\Admin\Traits\SqlQueryOperators;
use SleepingOwl\Admin\Contracts\ColumnFilterInterface;

abstract class BaseColumnFilter implements Renderable, ColumnFilterInterface, Arrayable
{
    use SqlQueryOperators, HtmlAttributes, Assets;

    /**
     * @var string
     */
    protected $view;

    /**
     * @var TemplateInterface
     */
    protected $template;

    /**
     * BaseColumnFilter constructor.
     *
     * @param TemplateInterface $template
     */
    public function __construct(TemplateInterface $template)
    {
        $this->template = $template;
        $this->initializePackage(
            $this->template->meta()
        );
    }

    /**
     * Initialize column filter.
     */
    public function initialize()
    {
        $this->includePackage(
            $this->template->meta()
        );
    }

    /**
     * @return string
     */
    public function getView()
    {
        return $this->view;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return [
            'attributes' => $this->htmlAttributesToString(),
        ];
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        return $this->template->view('column.filter.'.$this->getView(), $this->toArray());
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->render();
    }
}
