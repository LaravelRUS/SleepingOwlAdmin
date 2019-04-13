<?php

namespace SleepingOwl\Admin\Display;

use Request;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use SleepingOwl\Admin\Traits\PanelControl;
use Illuminate\Pagination\LengthAwarePaginator;
use SleepingOwl\Admin\Display\Extension\Columns;
use SleepingOwl\Admin\Display\Extension\ColumnsTotal;
use SleepingOwl\Admin\Display\Extension\ColumnFilters;
use SleepingOwl\Admin\Contracts\Display\ColumnInterface;
use SleepingOwl\Admin\Contracts\Display\ColumnMetaInterface;
use SleepingOwl\Admin\Contracts\Display\Extension\ColumnFilterInterface;

/**
 * Class DisplayTable.
 *
 * @method Columns getColumns()
 * @method $this setColumns(ColumnInterface|ColumnInterface[] $column)
 *
 * @method ColumnFilters getColumnFilters()
 * @method $this setColumnFilters(ColumnFilterInterface|ColumnFilterInterface[] $filters = null, ...$filters)
 */
class DisplayTable extends Display
{
    use PanelControl;

    /**
     * @var string
     */
    protected $view = 'display.table';

    /**
     * @var array
     */
    protected $parameters = [];

    /**
     * @var int|null
     */
    protected $paginate = 25;

    /**
     * @var string
     */
    protected $pageName = 'page';

    /**
     * @var Collection
     */
    protected $collection;

    /**
     * @var string|null
     */
    protected $newEntryButtonText;

    /**
     * Display constructor.
     */
    public function __construct()
    {
        parent::__construct();

        $this->extend('columns', new Columns());
        $this->extend('column_filters', new ColumnFilters());
        $this->extend('columns_total', new ColumnsTotal());
    }

    /**
     * Initialize display.
     */
    public function initialize()
    {
        parent::initialize();

        if ($this->getModelConfiguration()->isRestorableModel()) {
            $this->setApply(function (Builder $q) {
                return $q->withTrashed();
            });
        }

        $this->setHtmlAttribute('class', 'table table-striped');
    }

    /**
     * @return array|\Illuminate\Contracts\Translation\Translator|null|string
     */
    public function getNewEntryButtonText()
    {
        if (is_null($this->newEntryButtonText)) {
            $this->newEntryButtonText = trans('sleeping_owl::lang.table.new-entry');
        }

        return $this->newEntryButtonText;
    }

    /**
     * @param string $newEntryButtonText
     *
     * @return $this
     */
    public function setNewEntryButtonText($newEntryButtonText)
    {
        $this->newEntryButtonText = $newEntryButtonText;

        return $this;
    }

    /**
     * @return array
     */
    public function getParameters()
    {
        return $this->parameters;
    }

    /**
     * @param array $parameters
     *
     * @return $this
     */
    public function setParameters($parameters)
    {
        $this->parameters = $parameters;

        return $this;
    }

    /**
     * @param string $key
     * @param mixed  $value
     *
     * @return $this
     */
    public function setParameter($key, $value)
    {
        $this->parameters[$key] = $value;

        return $this;
    }

    /**
     * @param int    $perPage
     * @param string $pageName
     *
     * @return $this
     */
    public function paginate($perPage = 25, $pageName = 'page')
    {
        $this->paginate = (int) $perPage;
        $this->pageName = $pageName;

        return $this;
    }

    /**
     * @return $this
     */
    public function disablePagination()
    {
        $this->paginate = 0;

        return $this;
    }

    /**
     * @return bool
     */
    public function usePagination()
    {
        return $this->paginate > 0;
    }

    /**
     * @return array
     * @throws \Exception
     */
    public function toArray()
    {
        $model = $this->getModelConfiguration();

        $params = parent::toArray();

        $params['creatable'] = $model->isCreatable();
        $params['createUrl'] = $model->getCreateUrl($this->getParameters() + Request::all());
        $params['collection'] = $this->getCollection();

        $params['extensions'] = $this->getExtensions()->renderable()->sortByOrder();
        $params['newEntryButtonText'] = $this->getNewEntryButtonText();
        $params['panel_class'] = $this->getPanelClass();

        return $params;
    }

    /**
     * $collection Collection|LengthAwarePaginator|Builder.
     */
    public function setCollection($collection)
    {
        $this->collection = $collection;
    }

    /**
     * Apply offset and limit to the query.
     *
     * @param $query
     * @param \Illuminate\Http\Request $request
     */
    public function applyOffset($query, \Illuminate\Http\Request $request)
    {
        $offset = $request->input('start', 0);
        $limit = $request->input('length', 10);

        if ($limit == -1) {
            return;
        }

        $query->offset((int) $offset)->limit((int) $limit);
    }

    /**
     * Apply search to the query.
     *
     * @param Builder $query
     * @param \Illuminate\Http\Request $request
     */
    public function applySearch(Builder $query, \Illuminate\Http\Request $request)
    {
        $search = $request->input('search.value');
        if (empty($search)) {
            return;
        }

        $query->where(function (Builder $query) use ($search) {
            $columns = $this->getColumns()->all();

            foreach ($columns as $column) {
                if ($column->isSearchable()) {
                    if ($column instanceof ColumnInterface) {
                        if (($metaInstance = $column->getMetaData()) instanceof ColumnMetaInterface) {
                            if (method_exists($metaInstance, 'onSearch')) {
                                $metaInstance->onSearch($column, $query, $search);
                                continue;
                            }
                        }

                        if (is_callable($callback = $column->getSearchCallback())) {
                            $callback($column, $query, $search);
                            continue;
                        }
                    }

                    $query->orWhere($column->getName(), 'like', '%'.$search.'%');
                }
            }
        });
    }

    /**
     * @return Collection|LengthAwarePaginator|Builder
     * @throws \Exception
     */
    public function getCollection()
    {
        if (! $this->isInitialized()) {
            throw new \Exception('Display is not initialized');
        }

        if (! is_null($this->collection)) {
            return $this->collection;
        }

        $query = $this->getRepository()->getQuery();

        $this->modifyQuery($query);

        return $this->collection = $this->usePagination()
            ? $query->paginate($this->paginate, ['*'], $this->pageName)->appends(request()->except($this->pageName))
            : $query->get();
    }

    /**
     * @param \Illuminate\Database\Eloquent\Builder|Builder $query
     */
    protected function modifyQuery(\Illuminate\Database\Eloquent\Builder $query)
    {
        $this->extensions->modifyQuery($query);
    }
}
