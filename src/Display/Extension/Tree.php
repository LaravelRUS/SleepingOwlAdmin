<?php

namespace SleepingOwl\Admin\Display\Extension;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Support\Collection;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Display\ColumnInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Display\Column\Control;

class Tree extends Extension implements Initializable, Renderable
{
    use HtmlAttributes, \SleepingOwl\Admin\Traits\Renderable;

    /**
     * @var bool
     */
    protected $controlActive = true;

    /**
     * @var Collection
     */
    protected $columns;

    /**
     * @var string|\Illuminate\View\View
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
     * @param  ColumnInterface  $controlColumn
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
     * @return Collection|\SleepingOwl\Admin\Contracts\Display\ColumnInterface[]
     */
    public function all()
    {
        return $this->columns;
    }

    /**
     * @return Collection|\SleepingOwl\Admin\Contracts\Display\ColumnInterface[]
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
     * @param  ColumnInterface  $column
     * @return $this
     */
    public function push(ColumnInterface $column)
    {
        $this->columns->push($column);

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
            'columns' => $this->allWithControl(),
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
}
