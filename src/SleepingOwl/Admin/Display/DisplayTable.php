<?php namespace SleepingOwl\Admin\Display;

use AdminTemplate;
use Illuminate\Contracts\Support\Renderable;
use Input;
use SleepingOwl\Admin\Admin;
use SleepingOwl\Admin\Columns\Column;
use SleepingOwl\Admin\Interfaces\ColumnInterface;
use SleepingOwl\Admin\Interfaces\DisplayInterface;
use SleepingOwl\Admin\Repository\BaseRepository;

class DisplayTable implements Renderable, DisplayInterface
{

	protected $view = 'table';
	protected $class;
	protected $columns = [];
	protected $with = [];
	protected $repository;
	protected $apply;
	protected $scope;
	protected $filters = [];
	protected $activeFilters = [];
	protected $controlActive = true;
	protected $parameters = [];

	public function setClass($class)
	{
		if (is_null($this->class))
		{
			$this->class = $class;
		}
	}

	public function columns($columns = null)
	{
		if (is_null($columns))
		{
			return $this->columns;
		}
		$this->columns = $columns;
		return $this;
	}

	public function allColumns()
	{
		$columns = $this->columns();
		if ($this->controlActive())
		{
			$columns[] = Column::control();
		}
		return $columns;
	}

	public function with($with = null)
	{
		if (is_null($with))
		{
			return $this->with;
		}
		if ( ! is_array($with))
		{
			$with = func_get_args();
		}
		$this->with = $with;
		return $this;
	}

	public function filters($filters = null)
	{
		if (is_null($filters))
		{
			return $this->filters;
		}
		$this->filters = $filters;
		return $this;
	}

	public function apply($apply = null)
	{
		if (is_null($apply))
		{
			return $this->apply;
		}
		$this->apply = $apply;
		return $this;
	}

	public function scope($scope = null)
	{
		if (is_null($scope))
		{
			return $this->scope;
		}
		$this->scope = func_get_args();
		return $this;
	}

	public function title()
	{
		$titles = array_map(function ($filter)
		{
			return $filter->title();
		}, $this->activeFilters);
		return implode(', ', $titles);
	}

	public function initialize()
	{
		$this->repository = new BaseRepository($this->class);
		$this->repository->with($this->with());

		$this->initializeFilters();

		foreach ($this->allColumns() as $column)
		{
			if ($column instanceof ColumnInterface)
			{
				$column->initialize();
			}
		}
	}

	protected function initializeAction()
	{
		$action = Input::get('_action');
		$id = Input::get('_id');
		if ( ! is_null($action) && ! is_null($id))
		{
			foreach ($this->columns() as $column)
			{
				if ($column->name() == $action)
				{
					$column->call($this->repository->find($id));
				}
			}
		}
	}

	protected function initializeFilters()
	{
		$this->initializeAction();
		foreach ($this->filters() as $filter)
		{
			$filter->initialize();
			if ($filter->isActive())
			{
				$this->activeFilters[] = $filter;
			}
		}
	}

	protected function modifyQuery($query)
	{
		$scope = $this->scope();
		if ( ! is_null($scope))
		{
			$method = array_shift($scope);
			call_user_func_array([
				$query,
				$method
			], $scope);
		}
		$apply = $this->apply();
		if ( ! is_null($apply))
		{
			call_user_func($apply, $query);
		}
		foreach ($this->activeFilters as $filter)
		{
			$filter->apply($query);
		}
	}

	public function controlActive($controlActive = null)
	{
		if (is_null($controlActive))
		{
			return $this->controlActive;
		}
		$this->controlActive = $controlActive;
		return $this;
	}

	public function enableControls()
	{
		$this->controlActive(true);
		return $this;
	}

	public function disableControls()
	{
		$this->controlActive(false);
		return $this;
	}

	public function model()
	{
		return Admin::model($this->class);
	}

	public function parameters($parameters = null)
	{
		if (is_null($parameters))
		{
			return $this->parameters;
		}
		$this->parameters = $parameters;
		return $this;
	}

	protected function getParams()
	{
		return [
			'title'     => $this->title(),
			'columns'   => $this->allColumns(),
			'creatable' => ! is_null($this->model()->create()),
			'createUrl' => $this->model()->createUrl($this->parameters() + Input::all()),
		];
	}

	public function render()
	{
		$query = $this->repository->query();
		$this->modifyQuery($query);
		$params = $this->getParams();
		$params['collection'] = $query->get();
		return view(AdminTemplate::view('display.' . $this->view), $params);
	}

	function __toString()
	{
		return (string)$this->render();
	}

}