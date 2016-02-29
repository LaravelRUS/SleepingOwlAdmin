<?php

namespace SleepingOwl\Admin\Display;

use Request;
use Route;
use Illuminate\Support\Collection;
use Illuminate\Database\Query\Builder;
use SleepingOwl\Admin\Display\Column\Text;
use SleepingOwl\Admin\Display\Column\NamedColumn;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;

class DisplayDatatablesAsync extends DisplayDatatables implements WithRoutesInterface
{
    /**
     * Register display routes.
     */
    public static function registerRoutes()
    {
        Route::get('{adminModel}/async/{adminDisplayName?}', ['as' => 'admin.model.async',
            function ($model, $name = null) {
                $display = $model->display();
                if ($display instanceof DisplayTabbed) {
                    $display = static::findDatatablesAsyncByName($display, $name);
                }
                if ($display instanceof DisplayDatatablesAsync) {
                    return $display->renderAsync();
                }
                abort(404);
            },
        ]);
    }

    /**
     * Find DisplayDatatablesAsync in tabbed display by name.
     *
     * @param DisplayTabbed $display
     * @param string|null   $name
     *
     * @return DisplayDatatablesAsync|null
     */
    protected static function findDatatablesAsyncByName(DisplayTabbed $display, $name)
    {
        $tabs = $display->getTabs();
        foreach ($tabs as $tab) {
            $content = $tab->getContent();
            if ($content instanceof self && $content->getName() === $name) {
                return $content;
            }
        }
    }

    /**
     * @var string
     */
    protected $name;

    /**
     * @param string|null $name
     */
    protected $distinct;

    /**
     * DisplayDatatablesAsync constructor.
     *
     * @param string|null $name
     * @param string|null $distinct
     */
    public function __construct($name = null, $distinct = null)
    {
        $this->setName($name);
        $this->setDistinct($distinct);
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return mixed
     */
    public function getDistinct()
    {
        return $this->distinct;
    }

    /**
     * @param mixed $distinct
     */
    public function setDistinct($distinct)
    {
        $this->distinct = $distinct;
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        return app('sleeping_owl.template')->view('display.datatablesAsync', $this->toArray());
    }

    /**
     * Get view render parameters.
     * @return array
     */
    public function toArray()
    {
        $params = parent::toArray();

        $attributes = Request::all();
        array_unshift($attributes, $this->getName());
        array_unshift($attributes, $this->getModelConfiguration()->getAlias());
        $params['url'] = route('admin.model.async', $attributes);

        return $params;
    }

    /**
     * Render async request.
     * @return array
     */
    public function renderAsync()
    {
        $query = $this->getRepository()->getQuery();
        $totalCount = $query->count();
        $filteredCount = 0;

        if (! is_null($this->distinct)) {
            $filteredCount = $query->distinct()->count($this->getDistinct());
        }

        $this->modifyQuery($query);
        $this->applySearch($query);
        $this->applyColumnSearch($query);

        if (is_null($this->distinct)) {
            $filteredCount = $query->count();
        }

        $this->applyOrders($query);
        $this->applyOffset($query);
        $collection = $query->get();

        return $this->prepareDatatablesStructure($collection, $totalCount, $filteredCount);
    }

    /**
     * Apply offset and limit to the query.
     *
     * @param $query
     */
    protected function applyOffset($query)
    {
        $offset = Request::get('start', 0);
        $limit = Request::get('length', 10);

        if ($limit == -1) {
            return;
        }

        $query->offset($offset)->limit($limit);
    }

    /**
     * Apply orders to the query.
     *
     * @param $query
     */
    protected function applyOrders($query)
    {
        $orders = Request::get('order', []);

        foreach ($orders as $order) {
            $columnIndex = $order['column'];
            $orderDirection = $order['dir'];
            $column = $this->allColumns()[$columnIndex];

            if ($column instanceof NamedColumn && $column->isOrderable()) {
                $name = $column->name();
                $query->orderBy($name, $orderDirection);
            }
        }
    }

    /**
     * Apply search to the query.
     *
     * @param Builder $query
     */
    protected function applySearch(Builder $query)
    {
        $search = Request::get('search.value');
        if (is_null($search)) {
            return;
        }

        $query->where(function ($query) use ($search) {
            $columns = $this->columns();
            foreach ($columns as $column) {
                if ($column instanceof Text) {
                    $name = $column->name();
                    if ($this->repository->hasColumn($name)) {
                        $query->orWhere($name, 'like', '%'.$search.'%');
                    }
                }
            }
        });
    }

    /**
     * @param Builder $query
     */
    protected function applyColumnSearch(Builder $query)
    {
        $queryColumns = Request::get('columns', []);

        foreach ($queryColumns as $index => $queryColumn) {
            $search = array_get($queryColumn, 'search.value');
            $fullSearch = array_get($queryColumn, 'search');
            $column = array_get($this->columns(), $index);
            $columnFilter = array_get($this->columnFilters(), $index);

            if (! is_null($columnFilter)) {
                $columnFilter->apply($this->repository, $column, $query, $search, $fullSearch);
            }
        }
    }

    /**
     * Convert collection to the datatables structure.
     *
     * @param array|Collection $collection
     * @param int $totalCount
     * @param int $filteredCount
     *
     * @return array
     */
    protected function prepareDatatablesStructure(Collection $collection, $totalCount, $filteredCount)
    {
        $columns = $this->allColumns();

        $result = [];
        $result['draw'] = Request::get('draw', 0);
        $result['recordsTotal'] = $totalCount;
        $result['recordsFiltered'] = $filteredCount;
        $result['data'] = [];

        foreach ($collection as $instance) {
            $_row = [];
            foreach ($columns as $column) {
                $column->setInstance($instance);
                $_row[] = (string) $column;
            }

            $result['data'][] = $_row;
        }

        return $result;
    }
}
