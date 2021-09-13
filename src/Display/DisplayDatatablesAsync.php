<?php

namespace SleepingOwl\Admin\Display;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Routing\Router;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Request;
use SleepingOwl\Admin\Contracts\Display\ColumnInterface;
use SleepingOwl\Admin\Contracts\Display\ColumnMetaInterface;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;
use SleepingOwl\Admin\Display\Column\Control;

class DisplayDatatablesAsync extends DisplayDatatables implements WithRoutesInterface
{
    protected $rowClassCallback;

    /**
     * Register display routes.
     *
     * @param  Router  $router
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
     */
    public static function registerRoutes(Router $router)
    {
        $routeName = 'admin.display.async';
        if (! $router->has($routeName)) {
            $router->get('{adminModel}/async/{adminDisplayName?}', [
                'as' => $routeName,
                'uses' => 'SleepingOwl\Admin\Http\Controllers\DisplayController@async',
            ]);
        }

        $routeName = 'admin.display.async.inlineEdit';
        if (! $router->has($routeName)) {
            $router->post('{adminModel}/async/{adminDisplayName?}', [
                'as' => $routeName,
                'uses' => 'SleepingOwl\Admin\Http\Controllers\AdminController@inlineEdit',
            ]);
        }
    }

    protected $payload;
    /**
     * @var string
     */
    protected $name;

    /**
     * @param  string|null  $name
     */
    protected $distinct;

    /**
     * @var
     */
    protected $displaySearch = false;

    /**
     * @var
     */
    protected $displayLength = false;

    /**
     * DisplayDatatablesAsync constructor.
     *
     * @param  string|null  $name
     * @param  string|null  $distinct
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

        $this->setHtmlAttribute('style', 'width:100%');
        $this->setHtmlAttribute('data-url', route('admin.display.async', $attributes, false));
        $this->setHtmlAttribute('data-payload', json_encode($this->payload));

        if ($this->getDisplaySearch()) {
            $this->setHtmlAttribute('data-display-search', 1);
        }

        if ($this->getDisplayLength()) {
            $this->setHtmlAttribute('data-display-dtlength', 1);
        }
    }

    /**
     * @param  bool  $length
     * @return $this
     */
    public function setDisplayLength($length)
    {
        $this->displayLength = $length;

        return $this;
    }

    /**
     * @return bool
     */
    public function getDisplayLength()
    {
        return $this->displayLength;
    }

    /**
     * @param $search
     * @return $this
     */
    public function setDisplaySearch($search)
    {
        $this->displaySearch = $search;

        return $this;
    }

    /**
     * @return bool
     */
    public function getDisplaySearch()
    {
        return $this->displaySearch;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param  string  $name
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
     * @param  mixed  $distinct
     * @return $this
     */
    public function setDistinct($distinct)
    {
        $this->distinct = $distinct;

        return $this;
    }

    /**
     * Render async request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function renderAsync(\Illuminate\Http\Request $request)
    {
        $query = $this->getRepository()->getQuery();
        $totalCount = $query->count();
        $filteredCount = 0;

        if (! is_null($this->distinct)) {
            $filteredCount = $query->distinct()->count($this->getDistinct());
        }

        $this->modifyQuery($query);
        $this->applySearch($query, $request);

        if (is_null($this->distinct)) {
            $countQuery = clone $query;
            $countQuery->getQuery()->orders = null;
            $filteredCount = $countQuery->count();
        }

        $this->applyOffset($query, $request);
        $collection = $query->get();

        return $this->prepareDatatablesStructure($request, $collection, $totalCount, $filteredCount);
    }

    /**
     * Apply offset and limit to the query.
     *
     * @param  \Illuminate\Database\Query\Builder  $query
     * @param  \Illuminate\Http\Request  $request
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
     * @param  Builder  $query
     * @param  \Illuminate\Http\Request  $request
     */
    public function applySearch(Builder $query, \Illuminate\Http\Request $request)
    {
        $search = $request->input('search.value');
        if (empty($search)) {
            return;
        }

        $query->where(function (Builder $query) use ($search) {
            $columns = $this->getColumns()->all();

            $_model = $query->getModel();

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

                    if ($_model->getAttribute($column->getName())) {
                        continue;
                    }

                    $query->orWhere($column->getName(), 'like', '%'.$search.'%');
                }
            }
        });
    }

    /**
     * Convert collection to the datatables structure.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  array|Collection  $collection
     * @param  int  $totalCount
     * @param  int  $filteredCount
     * @return array
     */
    protected function prepareDatatablesStructure(
        \Illuminate\Http\Request $request,
        Collection $collection,
        $totalCount,
        $filteredCount
    ) {
        $columns = $this->getColumns();

        $result = [];
        $result['draw'] = $request->input('draw', 0);
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
            if (is_callable($callback = $this->rowClassCallback)) {
                $class = $callback($instance);
                if (is_array($class)) {
                    $class = implode(' ', $class);
                }

                $add_class = [];
                $add_class['add_class'] = $class;
                $_row[] = (object) $add_class;
            }

            $result['data'][] = $_row;
        }

        return $result;
    }

    /**
     * @return \Closure|mixed
     */
    public function getRowClassCallback()
    {
        return $this->rowClassCallback;
    }

    /**
     * @param  \Closure  $callback
     * @return $this
     */
    public function setRowClassCallback($callback)
    {
        $this->rowClassCallback = $callback;

        return $this;
    }

    /**
     * @return void
     */
    public function getCollection()
    {
    }

    /**
     * @param $payload
     */
    public function setPayload($payload)
    {
        $this->payload = $payload;
    }

    /**
     * @return mixed
     */
    public function getPayload()
    {
        return $this->payload;
    }

    /**
     * @return array
     *
     * @throws \Exception
     */
    public function toArray()
    {
        $params = parent::toArray();
        $params['payload'] = $this->payload;

        return $params;
    }
}
