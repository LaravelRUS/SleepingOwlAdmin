<?php

namespace SleepingOwl\Admin\Display;

use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use KodiCMS\Assets\Package;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Contracts\Display\DisplayColumnFactoryInterface;
use SleepingOwl\Admin\Display\Column\Email;
use SleepingOwl\Admin\Display\Column\Link;
use SleepingOwl\Admin\Display\Column\Text;
use SleepingOwl\Admin\Display\Column\NamedColumn;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;
use SleepingOwl\Admin\Factories\RepositoryFactory;
use SleepingOwl\Admin\Http\Controllers\DatatablesAsyncController;
use Symfony\Component\Translation\TranslatorInterface;

class DisplayDatatablesAsync extends DisplayDatatables implements WithRoutesInterface
{
    /**
     * Register display routes.
     *
     * @param Router $router
     */
    public static function registerRoutes(Router $router)
    {
        $router->get('{adminModel}/async/{adminDisplayName?}')
            ->uses(DatatablesAsyncController::class.'@data')
            ->name('admin.model.async');
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
     * @var array
     */
    protected $searchableColumns = [
        Text::class,
        Link::class,
        Email::class,
    ];

    /**
     * DisplayDatatablesAsync constructor.
     *
     * @param RepositoryFactory $repositoryFactory
     * @param AdminInterface $admin
     * @param Factory $viewFactory
     * @param Package $package
     * @param Request $request
     * @param DisplayColumnFactoryInterface $displayColumnFactory
     * @param TranslatorInterface $translator
     * @param null $name
     * @param null $distinct
     */
    public function __construct(RepositoryFactory $repositoryFactory,
                                AdminInterface $admin,
                                Factory $viewFactory,
                                Package $package,
                                Request $request,
                                DisplayColumnFactoryInterface $displayColumnFactory,
                                TranslatorInterface $translator,
                                $name = null, $distinct = null)
    {
        parent::__construct($repositoryFactory, $admin, $viewFactory,
            $package, $request, $displayColumnFactory, $translator);

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

        $attributes = $this->request->all();
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
     *
     * @return $this
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
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
     *
     * @return $this
     */
    public function setDistinct($distinct)
    {
        $this->distinct = $distinct;

        return $this;
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
        $offset = $this->request->input('start', 0);
        $limit = $this->request->input('length', 10);

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
        $orders = $this->request->input('order', []);

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
        $search = $this->request->input('search.value');
        if (empty($search)) {
            return;
        }

        $query->where(function ($query) use ($search) {
            $columns = $this->getColumns()->all();
            foreach ($columns as $column) {
                if (in_array(get_class($column), $this->searchableColumns)) {
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
        $queryColumns = $this->request->input('columns', []);

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
        $result['draw'] = $this->request->input('draw', 0);
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
