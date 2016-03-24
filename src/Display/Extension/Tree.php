<?php

namespace SleepingOwl\Admin\Display\Extension;

use Illuminate\Support\Collection;
use KodiComponents\Support\HtmlAttributes;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Display\Column\Control;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\ColumnInterface;

class Tree extends Extension implements Initializable, Renderable
{
    use HtmlAttributes;

    /**
     * @var bool
     */
    protected $controlActive = true;

    /**
     * @var string
     */
    protected $view = 'display.columns';

    /**
     * @var Control
     */
    protected $controlColumn;

    public function __construct()
    {
        $this->columns = new Collection();

        $this->setControlColumn(app('sleeping_owl.table.column')->treeControl());
    }

    /**
     * @param ColumnInterface $controlColumn
     *
     * @return $this
     */
    public function setControlColumn(ColumnInterface $controlColumn)
    {
        $this->controlColumn = $controlColumn;

        return $this;
    }

    /**
     * @return Control
     */
    public function getControlColumn()
    {
        return $this->controlColumn;
    }

    /**
     * @return bool
     */
    public function isControlActive()
    {
        return $this->controlActive;
    }

    /**
     * @return $this
     */
    public function enableControls()
    {
        $this->controlActive = true;

        return $this;
    }

    /**
     * @return $this
     */
    public function disableControls()
    {
        $this->controlActive = true;

        return $this;
    }

    /**
     * @return Collection|\SleepingOwl\Admin\Contracts\ColumnInterface[]
     */
    public function all()
    {
        return $this->columns;
    }

    /**
     * @return Collection|\SleepingOwl\Admin\Contracts\ColumnInterface[]
     */
    public function allWithControl()
    {
        $columns = $this->all();

        if ($this->isControlActive()) {
            $columns->push($this->getControlColumn());
        }

        return $columns;
    }

    /**
     * @param ColumnInterface $column
     *
     * @return $this
     */
    public function push(ColumnInterface $column)
    {
        $this->columns->push($column);

        return $this;
    }

    /**
     * @return string
     */
    public function getView()
    {
        return $this->view;
    }

    /**
     * @param string $view
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
            'columns'    => $this->allWithControl(),
            'attributes' => $this->htmlAttributesToString(),
        ];
    }

    public function initialize()
    {
        $this->allWithControl()->each(function (ColumnInterface $column) {
            $column->initialize();
        });

        $this->setHtmlAttribute('class', 'table table-striped');
    }

    /**
     * Get the evaluated contents of the object.
     *
     * @return string
     */
    public function render()
    {
        return app('sleeping_owl.template')->view($this->getView(), $this->toArray());
    }
}
