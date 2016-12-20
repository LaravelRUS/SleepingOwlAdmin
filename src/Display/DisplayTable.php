<?php

namespace SleepingOwl\Admin\Display;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Display\Column\Control;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Contracts\ColumnInterface;
use SleepingOwl\Admin\Display\Extension\Columns;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Contracts\ColumnFilterInterface;
use SleepingOwl\Admin\Display\Extension\ColumnFilters;
use SleepingOwl\Admin\Contracts\Display\DisplayExtensionInterface;

/**
 * Class DisplayTable.

 * @method Columns getColumns()
 * @method $this setColumns(ColumnInterface|ColumnInterface[] $column)
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
     * @var Request
     */
    protected $request;

    /**
     * Display constructor.
     *
     * @param AdminInterface $admin
     * @param RepositoryInterface $repository
     * @param Control $control
     * @param Request $request
     *
     * @internal param TemplateInterface $template
     */
    public function __construct(AdminInterface $admin, RepositoryInterface $repository, Control $control, Request $request)
    {
        parent::__construct($admin, $repository);

        $this->request = $request;

        $this->extend('columns', new Columns($control));
        $this->extend('column_filters', new ColumnFilters());
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

        $this->getColumns()->all()->each(function (ColumnInterface $column) {
            $column->setModelConfiguration($this->getModelConfiguration());
        });

        $this->setHtmlAttribute('class', 'table table-striped');
    }

    /**
     * @return null|string
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
     */
    public function toArray()
    {
        $model = $this->getModelConfiguration();

        $params = parent::toArray();

        $params['creatable'] = $model->isCreatable();
        $params['createUrl'] = $model->getCreateUrl($this->getParameters() + $this->request->all());
        $params['collection'] = $this->getCollection();

        $params['extensions'] = $this->getExtensions()
            ->filter(function (DisplayExtensionInterface $ext) {
                return $ext instanceof Renderable;
            })
            ->sortBy(function (DisplayExtensionInterface $extension) {
                return $extension->getOrder();
            });

        $params['newEntryButtonText'] = $this->getNewEntryButtonText();

        return $params;
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
        $this->applyOrders($query);

        return $this->collection = $this->usePagination()
            ? $query->paginate($this->paginate, ['*'], $this->pageName)
                ->appends($this->request->except($this->pageName))
            : $query->get();
    }

    /**
     * Apply orders to the query.
     *
     * @param $query
     */
    protected function applyOrders(Builder $query)
    {
        $orders = $this->request->input('order', []);

        $columns = $this->getColumns()->all();

        if (! is_int(key($orders))) {
            $orders = [$orders];
        }

        foreach ($orders as $order) {
            $columnIndex = array_get($order, 'column');
            $direction = array_get($order, 'dir', 'asc');

            if (! $columnIndex && $columnIndex !== '0') {
                continue;
            }

            $column = $columns->get($columnIndex);

            if ($column instanceof ColumnInterface && $column->isOrderable()) {
                $column->orderBy($query, $direction);
            }
        }
    }

    /**
     * @param \Illuminate\Database\Eloquent\Builder|Builder $query
     */
    protected function modifyQuery(Builder $query)
    {
        $this->extensions->each(function (DisplayExtensionInterface $extension) use ($query) {
            $extension->modifyQuery($query);
        });
    }
}
