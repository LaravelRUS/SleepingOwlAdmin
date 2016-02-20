<?php

namespace SleepingOwl\Admin\Display;

use Request;
use Closure;
use SleepingOwl\Admin\Column;
use Illuminate\Database\Eloquent\Builder;
use SleepingOwl\Admin\Traits\HtmlAttributes;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Model\ModelConfiguration;
use SleepingOwl\Admin\Repository\BaseRepository;
use SleepingOwl\Admin\Contracts\FilterInterface;
use SleepingOwl\Admin\Contracts\ColumnInterface;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Contracts\NamedColumnInterface;
use SleepingOwl\Admin\Contracts\ColumnActionInterface;

class DisplayTable implements Renderable, DisplayInterface
{
    use HtmlAttributes;

    /**
     * @var string
     */
    protected $view = 'table';

    /**
     * @var string
     */
    protected $class;

    /**
     * @var array
     */
    protected $columns = [];

    /**
     * @var array
     */
    protected $with = [];

    /**
     * @var RepositoryInterface
     */
    protected $repository;

    /**
     * @var Closure
     */
    protected $apply;

    /**
     * @var array
     */
    protected $scopes = [];

    /**
     * @var FilterInterface[]
     */
    protected $filters = [];

    /**
     * @var FilterInterface[]
     */
    protected $activeFilters = [];

    /**
     * @var bool
     */
    protected $controlActive = true;

    /**
     * @var array
     */
    protected $parameters = [];

    /**
     * @var ColumnActionInterface[]
     */
    protected $actions = [];

    /**
     * @param string $class
     */
    public function setClass($class)
    {
        if (is_null($this->class)) {
            $this->class = $class;
        }
    }

    /**
     * @return string
     */
    public function getClass()
    {
        return $this->class;
    }

    public function initialize()
    {
        $this->repository = new BaseRepository($this->getClass());
        $this->repository->setWith($this->getWith());
        $this->initializeFilters();
        foreach ($this->getAllColumns() as $column) {
            if ($column instanceof ColumnInterface) {
                $column->initialize();
            }
        }

        $this->setAttribute('class', 'table table-striped');
    }

    /**
     * @return array
     */
    public function getColumns()
    {
        return $this->columns;
    }

    /**
     * @param array $columns
     *
     * @return $this
     */
    public function setColumns(array $columns)
    {
        $this->columns = $columns;

        return $this;
    }

    /**
     * @return array
     */
    public function getAllColumns()
    {
        $columns = $this->getColumns();
        if ($this->isControlActive()) {
            $columns[] = Column::control();
        }

        return $columns;
    }

    /**
     * @return \string[]
     */
    public function getWith()
    {
        return $this->with;
    }

    /**
     * @param \string[] $with
     *
     * @return $this
     */
    public function setWith($with)
    {
        if (! is_array($with)) {
            $with = func_get_args();
        }

        $this->with = $with;

        return $this;
    }

    /**
     * @param Closure $apply
     */
    public function setApply(Closure $apply)
    {
        $this->apply = $apply;

        return $this;
    }

    /**
     * @return FilterInterface[]
     */
    public function getFilters()
    {
        return $this->filters;
    }

    /**
     * @param array $filters
     *
     * @return $this
     */
    public function setFilters($filters)
    {
        if (! is_array($filters)) {
            $filters = func_get_args();
        }

        $this->filters = $filters;

        return $this;
    }

    /**
     * @param string $filter
     *
     * @return $this
     */
    public function appendFilter($filter)
    {
        $this->filters[] = $filter;

        return $this;
    }

    /**
     * @return array
     */
    public function getScopes()
    {
        return $this->scopes;
    }

    /**
     * @param array $scopes
     *
     * @return $this
     */
    public function setScopes(array $scopes)
    {
        $this->scopes = $scopes;

        return $this;
    }

    /**
     * @param string $scope
     *
     * @return $this
     */
    public function appendScope($scope)
    {
        if (! is_array($scope)) {
            $scope = func_get_args();
        }

        $this->scopes[] = $scope;

        return $this;
    }

    /**
     * @return \SleepingOwl\Admin\Contracts\FilterInterface[]
     */
    public function getActiveFilters()
    {
        return $this->activeFilters;
    }

    /**
     * @param array $activeFilters
     *
     * @return $this
     */
    public function setActiveFilters($activeFilters)
    {
        if (! is_array($activeFilters)) {
            $activeFilters = func_get_args();
        }

        $this->activeFilters = $activeFilters;

        return $this;
    }

    /**
     * @return bool
     */
    public function isControlActive()
    {
        return $this->controlActive;
    }

    /**
     * @return $this
     */
    public function enableControls()
    {
        $this->setControlActive(true);

        return $this;
    }

    /**
     * @return $this
     */
    public function disableControls()
    {
        $this->setControlActive(false);

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
     * @return \SleepingOwl\Admin\Contracts\ColumnActionInterface[]
     */
    public function getActions()
    {
        foreach ($this->actions as $action) {
            $action->setUrl($this->getModel()->getDeleteUrl([
                '_action' => $action->getName(),
                '_ids'    => '',
            ]));
        }

        return $this->actions;
    }

    /**
     * @param array|string $actions
     *
     * @return $this
     */
    public function setActions($actions)
    {
        if (! is_array($actions)) {
            $actions = func_get_args();
        }

        $this->actions = $actions;

        return $this;
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        $titles = array_map(function (FilterInterface $filter) {
            return $filter->getTitle();
        }, $this->getActiveFilters());

        return implode(', ', $titles);
    }

    /**
     * @return array
     */
    public function getParams()
    {
        $model = $this->getModel();

        return [
            'title'     => $this->getTitle(),
            'columns'   => $this->getAllColumns(),
            'creatable' => ! is_null($model->fireCreate()),
            'createUrl' => $model->getCreateUrl($this->getParameters() + Request::all()),
            'actions'   => $this->getActions(),
            'attributes' => $this->getAttributes()
        ];
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        $query = $this->getRepository()->getQuery();
        $this->modifyQuery($query);
        $params = $this->getParams();
        $params['collection'] = $query->get();

        return app('sleeping_owl.template')->view('display.'.$this->view, $params);
    }

    public function getColection()
    {

    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return $this->getParams();
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->render();
    }

    /**
     * @return RepositoryInterface
     */
    protected function getRepository()
    {
        return $this->repository;
    }

    protected function initializeAction()
    {
        $action = Request::get('_action');
        $id = Request::get('_id');
        $ids = Request::get('_ids');

        if (! is_null($action) && (! is_null($id) || ! is_null($ids))) {
            $columns = array_merge($this->getColumns(), $this->getActions());
            foreach ($columns as $column) {
                if (! $column instanceof NamedColumnInterface) {
                    continue;
                }

                if ($column->getName() == $action) {
                    $param = null;

                    if (! is_null($id)) {
                        $param = $this->getRepository()->find($id);
                    } else {
                        $ids = explode(',', $ids);
                        $param = $this->getRepository()->findMany($ids);
                    }

                    $column->call($param);
                }
            }
        }
    }

    protected function initializeFilters()
    {
        $this->initializeAction();

        foreach ($this->getFilters() as $filter) {
            $filter->initialize();
            if ($filter->isActive()) {
                $this->activeFilters[] = $filter;
            }
        }
    }

    /**
     * @param Builder $query
     */
    protected function modifyQuery(Builder $query)
    {
        foreach ($this->getScopes() as $scope) {
            if (! is_null($scope)) {
                $method = array_shift($scope);

                call_user_func_array([
                    $query,
                    $method,
                ], $scope);
            }
        }

        $this->apply($query);
        foreach ($this->getActiveFilters() as $filter) {
            $filter->apply($query);
        }
    }

    /**
     * @return ModelConfiguration
     */
    protected function getModel()
    {
        return app('sleeping_owl')->getModel($this->getClass());
    }

    /**
     * @param bool $controlActive
     *
     * @return $this
     */
    protected function setControlActive($controlActive)
    {
        $this->controlActive = (bool) $controlActive;
    }

    /**
     * @param Builder $query
     *
     * @return mixed
     */
    protected function apply(Builder $query)
    {
        if (is_callable($this->apply)) {
            call_user_func($this->apply, $query);
        }
    }
}
