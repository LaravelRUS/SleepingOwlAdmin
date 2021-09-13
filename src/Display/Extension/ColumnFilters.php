<?php

namespace SleepingOwl\Admin\Display\Extension;

use Illuminate\Support\Arr;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Display\ColumnInterface;
use SleepingOwl\Admin\Contracts\Display\Extension\ColumnFilterInterface;
use SleepingOwl\Admin\Contracts\Display\Placable;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Display\Column\Filter\Control;

class ColumnFilters extends Extension implements Initializable, Placable
{
    use HtmlAttributes;

    /**
     * @var ColumnFilterInterface[]
     */
    protected $columnFilters = [];

    /**
     * @var string|\Illuminate\View\View
     */
    protected $view = 'display.extensions.columns_filters_table';

    /**
     * @var string
     */
    protected $placement = 'table.footer';

    /**
     * @param  array|ColumnFilterInterface  $columnFilters
     * @return $this
     */
    public function set($columnFilters)
    {
        if (! is_array($columnFilters)) {
            $columnFilters = func_get_args();
        }

        $this->columnFilters = [];

        foreach ($columnFilters as $filter) {
            $this->push($filter);
        }

        return $this;
    }

    /**
     * @return ColumnFilterInterface[]
     */
    public function all()
    {
        return $this->columnFilters;
    }

    /**
     * @param  ColumnFilterInterface  $filter
     * @return $this
     */
    public function push(ColumnFilterInterface $filter = null)
    {
        $this->columnFilters[] = $filter;

        return $this;
    }

    /**
     * Remove last element.
     */
    public function pop()
    {
        array_pop($this->columnFilters);
    }

    /**
     * @return string|\Illuminate\View\View
     */
    public function getView()
    {
        return $this->view;
    }

    /**
     * @param  string|\Illuminate\View\View  $view
     * @return $this
     */
    public function setView($view)
    {
        $this->view = $view;

        return $this;
    }

    /**
     * @return string
     */
    public function getPlacement()
    {
        return $this->placement;
    }

    /**
     * @param  string  $placement
     * @return $this
     */
    public function setPlacement($placement)
    {
        $this->placement = $placement;

        return $this;
    }

    /**
     * @return string
     *
     * @deprecated use getPlacement()
     */
    public function getPosition()
    {
        return $this->getPlacement();
    }

    /**
     * @param  string  $position
     * @return $this
     *
     * @deprecated use setPlacement(string $placement)
     */
    public function setPosition($position)
    {
        return $this->setPlacement($position);
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        $this->setHtmlAttribute('data-display', class_basename($this->getDisplay()));

        return [
            'filters' => $this->columnFilters,
            'attributes' => $this->htmlAttributesToString(),
            'tag' => $this->getPlacement() == 'table.header' ? 'thead' : 'tfoot',
        ];
    }

    /**
     * Initialize class.
     */
    public function initialize()
    {
        if (empty($this->columnFilters)) {
            return;
        }

        $this->validNumberOfFilters();

        foreach ($this->all() as $filter) {
            if ($filter instanceof Initializable) {
                $filter->initialize();
            }
        }

        $this->validNumberOfFilters();

        $filters = collect($this->columnFilters);

        if ($filters->last() === null) {
            $filters->pop();
            $filters->push(new Control());
        }

        $this->columnFilters = $filters;

        $this->prepareView();
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     */
    public function modifyQuery(\Illuminate\Database\Eloquent\Builder $query)
    {
        $search = app('request')->get('columns', []);

        $display = $this->getDisplay();

        if (! $display->getExtensions()->has('columns')) {
            return;
        }

        $columns = $display->getColumns()->all();

        if (! is_int(key($search))) {
            $search = [$search];
        }

        foreach ($search as $index => $columnData) {
            $column = $columns->get($index);
            $columnFilter = Arr::get($this->all(), $index);

            if ($column && $column instanceof ColumnInterface && $columnFilter) {
                $columnFilter->apply(
                    $column,
                    $query,
                    Arr::get($columnData, 'search.value'),
                    Arr::get($columnData, 'search')
                );
            }
        }
    }

    protected function validNumberOfFilters()
    {
        $display = $this->getDisplay();

        if ($display->getExtensions()->has('columns')) {
            $totalColumns = count($display->getColumns()->all());
            $totalFilters = count($this->all());
            $missedFilters = $totalColumns - $totalFilters;

            while ($missedFilters > 0) {
                $this->push(null);
                $missedFilters--;
            }
        }
    }

    protected function prepareView()
    {
        if (! in_array($this->getPlacement(), ['table.footer', 'table.header']) && $this->view == 'display.extensions.columns_filters_table') {
            $this->view = 'display.extensions.columns_filters';
            $this->setHtmlAttribute('class', 'display-filters-top');
            $this->setHtmlAttribute('class', 'table table-default');
        }

        $this->setHtmlAttribute('class', 'display-filters');
    }
}
