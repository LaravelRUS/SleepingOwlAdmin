<?php

namespace SleepingOwl\Admin\Display;

use Request;
use Illuminate\Routing\Router;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use SleepingOwl\Admin\Display\Column\Link;
use SleepingOwl\Admin\Display\Column\Text;
use SleepingOwl\Admin\Display\Column\Email;
use Illuminate\Http\Request as InlineRequest;
use SleepingOwl\Admin\Display\Column\Control;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;

class DisplayDatatablesAsync extends DisplayDatatables implements WithRoutesInterface
{
    /**
     * Register display routes.
     *
     * @param Router $router
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
     */
    public static function registerRoutes(Router $router)
    {
        $router->get('{adminModel}/async/{adminDisplayName?}', [
            'as' => 'admin.model.async',
            function (ModelConfigurationInterface $model, $name = null) {
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
        $router->post('{adminModel}/async/{adminDisplayName?}', [
            'as' => 'admin.model.async.inline',
            function (ModelConfigurationInterface $model, InlineRequest $request) {
                $field = $request->input('name');
                $value = $request->input('value');
                $id = $request->input('pk');

                $display = $model->fireDisplay();

                /** @var ColumnEditableInterface|null $column */
                $column = $display->getColumns()->all()->filter(function ($column) use ($field) {
                    return ($column instanceof ColumnEditableInterface) and $field == $column->getName();
                })->first();

                if (is_null($column)) {
                    abort(404);
                }

                $model->saveColumn($column, $value, $id);

                if ($display instanceof DisplayDatatablesAsync) {
                    return $display->renderAsync();
                }
            },
        ]);
    }

    /**
     * Find DisplayDatatablesAsync in tabbed display by name.
     *
     * @param DisplayTabbed $display
     * @param string|null $name
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
        $offset = Request::input('start', 0);
        $limit = Request::input('length', 10);

        if ($limit == -1) {
            return;
        }

        $query->offset($offset)->limit($limit);
    }

    /**
     * Apply search to the query.
     *
     * @param Builder $query
     */
    protected function applySearch(Builder $query)
    {
        $search = Request::input('search.value');
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

                if ($column instanceof Control) {
                    $column->initialize();
                }

                $_row[] = (string) $column;
            }

            $result['data'][] = $_row;
        }

        return $result;
    }
}
