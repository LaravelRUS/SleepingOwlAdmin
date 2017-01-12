<?php

namespace SleepingOwl\Admin\Display;

use Request;
use Illuminate\Routing\Router;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use SleepingOwl\Admin\Display\Column\Link;
use SleepingOwl\Admin\Display\Column\Text;
use SleepingOwl\Admin\Display\Column\Email;
use SleepingOwl\Admin\Display\Column\Control;
use Illuminate\Contracts\Foundation\Application;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;

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
        $routeName = 'admin.display.async';
        if (! $router->has($routeName)) {
            $router->get('{adminModel}/async/{adminDisplayName?}', [
                'as' => $routeName,
                'uses' => 'SleepingOwl\Admin\Http\Controllers\DisplayController@async'
            ]);
        }

        $routeName = 'admin.display.async.inlineEdit';
        if (! $router->has($routeName)) {
            $router->post('{adminModel}/async/{adminDisplayName?}', [
                'as' => $routeName,
                'uses' => 'SleepingOwl\Admin\Http\Controllers\AdminController@inlineEdit'
            ]);
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

        $this->setHtmlAttribute('data-url', route('admin.display.async', $attributes));
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
     *
     * @param \Illuminate\Http\Request $request
     *
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
            $filteredCount = $query->count();
        }

        $this->applyOffset($query, $request);
        $collection = $query->get();

        return $this->prepareDatatablesStructure($request, $collection, $totalCount, $filteredCount);
    }

    /**
     * Apply offset and limit to the query.
     *
     * @param $query
     * @param \Illuminate\Http\Request $request
     */
    protected function applyOffset($query, \Illuminate\Http\Request $request)
    {
        $offset = $request->input('start', 0);
        $limit = $request->input('length', 10);

        if ($limit == -1) {
            return;
        }

        $query->offset($offset)->limit($limit);
    }

    /**
     * Apply search to the query.
     *
     * @param Builder $query
     * @param \Illuminate\Http\Request $request
     */
    protected function applySearch(Builder $query, \Illuminate\Http\Request $request)
    {
        $search = $request->input('search.value');
        if (empty($search)) {
            return;
        }

        $query->where(function ($query) use ($search) {
            $columns = $this->getColumns()->all();
            foreach ($columns as $column) {
                if (in_array(get_class($column), $this->searchableColumns)) {
                    $query->orWhere($column->getName(), 'like', '%'.$search.'%');
                }
            }
        });
    }

    /**
     * Convert collection to the datatables structure.
     *
     * @param \Illuminate\Http\Request $request
     * @param array|Collection $collection
     * @param int $totalCount
     * @param int $filteredCount
     *
     * @return array
     */
    protected function prepareDatatablesStructure(\Illuminate\Http\Request $request, Collection $collection, $totalCount, $filteredCount)
    {
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

            $result['data'][] = $_row;
        }

        return $result;
    }
}
