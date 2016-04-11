<?php

namespace SleepingOwl\Admin\Display;

use Request;
use Route;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use SleepingOwl\Admin\Display\Column\Text;
use SleepingOwl\Admin\Display\Column\NamedColumn;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;
use SleepingOwl\Admin\Model\ModelConfiguration;

class DisplayDatatablesAsync extends DisplayDatatables implements WithRoutesInterface
{
    /**
     * Register display routes.
     */
    public static function registerRoutes()
    {
        Route::get('{adminModel}/async/{adminDisplayName?}', ['as' => 'admin.model.async',
            function (ModelConfiguration $model, $name = null) {
                $display = $model->fireDisplay();
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
        parent::__construct();

        $this->setName($name);
        $this->setDistinct($distinct);

        $this->getColumns()->setView('display.extensions.columns_async');
    }

    /**
     * Initialize display.
     */
    public function initialize()
    {
        parent::initialize();

        $attributes = Request::all();
        array_unshift($attributes, $this->getName());
        array_unshift($attributes, $this->getModelConfiguration()->getAlias());

        $this->setHtmlAttribute('data-url', route('admin.model.async', $attributes));
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
        $offset = Request::input('start', 0);
        $limit = Request::input('length', 10);

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
        $orders = Request::input('order', []);

        foreach ($orders as $order) {
            $columnIndex = $order['column'];
            $orderDirection = $order['dir'];
            $column = $this->getColumns()->all()->get($columnIndex);

            if ($column instanceof NamedColumn && $column->isOrderable()) {
                $name = $column->getName();
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
        $search = Request::input('search.value');
        if (is_null($search)) {
            return;
        }

        $query->where(function ($query) use ($search) {
            $columns = $this->getColumns()->all();
            foreach ($columns as $column) {
                if ($column instanceof Text) {
                    $name = $column->getName();
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
        $queryColumns = Request::input('columns', []);

        foreach ($queryColumns as $index => $queryColumn) {
            $search = array_get($queryColumn, 'search.value');
            $fullSearch = array_get($queryColumn, 'search');
            $column = $this->getColumns()->all()->get($index);
            $columnFilter = array_get($this->getColumnFilters()->all(), $index);

            if (! is_null($columnFilter) && ! is_null($column)) {
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
        $columns = $this->getColumns();

        $result = [];
        $result['draw'] = Request::input('draw', 0);
        $result['recordsTotal'] = $totalCount;
        $result['recordsFiltered'] = $filteredCount;
        $result['data'] = [];

        foreach ($collection as $instance) {
            $_row = [];

            foreach ($columns->all() as $column) {
                $column->setModel($instance);
                $_row[] = (string) $column;
            }

            $result['data'][] = $_row;
        }

        return $result;
    }
}
