<?php

namespace SleepingOwl\Admin\Display;

use Request;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Contracts\ColumnInterface;
use SleepingOwl\Admin\Display\Extension\Columns;
use SleepingOwl\Admin\Display\Extension\ColumnFilters;
use SleepingOwl\Admin\Contracts\ColumnFilterInterface;
use SleepingOwl\Admin\Contracts\Display\DisplayExtensionInterface;

/**
 * Class DisplayTable.

 * @method Columns getColumns()
 * @method $this setColumns(ColumnInterface $column, ... $columns)
 *
 * @method ColumnFilters getColumnFilters()
 * @method $this setColumnFilters(ColumnFilterInterface $filters = null, ...$filters)
 */
class DisplayTable extends Display
{
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
    protected $paginate;

    /**
     * @var string
     */
    protected $pageName;

    /**
     * @var Collection
     */
    protected $collection;

    /**
     * Display constructor.
     */
    public function __construct()
    {
        parent::__construct();

        $this->extend('columns', new Columns());
        $this->extend('columnfilters', new ColumnFilters());
    }

    /**
     * Initialize display.
     */
    public function initialize()
    {
        parent::initialize();

        if ($this->getModelConfiguration()->isRestorableModel()) {
            $this->setApply(function ($q) {
                return $q->withTrashed();
            });
        }

        $this->setHtmlAttribute('class', 'table table-striped');
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
    public function paginate($perPage = 20, $pageName = 'page')
    {
        $this->paginate = (int) $perPage;
        $this->pageName = $pageName;

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
     */
    public function toArray()
    {
        $model = $this->getModelConfiguration();

        $params = parent::toArray();

        $params['creatable'] = $model->isCreatable();
        $params['createUrl'] = $model->getCreateUrl($this->getParameters() + Request::all());
        $params['collection'] = $this->getCollection();

        $params['extensions'] = $this->getExtensions()->filter(function (DisplayExtensionInterface $ext) {
            return $ext instanceof Renderable;
        });

        return $params;
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

    /**
     * @return Collection
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
            ? $query->paginate($this->paginate, ['*'], $this->pageName)
            : $query->get();
    }

    /**
     * @param \Illuminate\Database\Eloquent\Builder|Builder $query
     */
    protected function modifyQuery(\Illuminate\Database\Eloquent\Builder $query)
    {
        $this->extensions->each(function (DisplayExtensionInterface $extension) use ($query) {
            $extension->modifyQuery($query);
        });
    }
}
