<?php namespace SleepingOwl\Admin\Repository;

use Cache;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\SoftDeletes;
use Schema;

class BaseRepository
{

	protected $class;
	protected $model;

	protected $with = [];

	function __construct($class)
	{
		$this->class = $class;
		$this->model(app($this->class));
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

	public function query()
	{
		$query = $this->model->query();
		$query->with($this->with());
		return $query;
	}

	public function find($id)
	{
		return $this->model->find($id);
	}

	public function findMany($ids)
	{
		$query = $this->model->query();
		if (method_exists($this->model, 'withTrashed'))
		{
			$query->withTrashed();
		}
		return $query->whereIn($this->model->getKeyName(), $ids)->get();
	}

	public function delete($id)
	{
		$this->find($id)->delete();
	}

	public function restore($id)
	{
		$this->query()->onlyTrashed()->find($id)->restore();
	}

	public function model($model = null)
	{
		if (is_null($model))
		{
			return $this->model;
		}
		$this->model = $model;
		return $this;
	}

	public function hasColumn($column)
	{
		$table = $this->model->getTable();
		$columns = Cache::remember('admin.columns.' . $table, 60, function () use ($table)
		{
			return Schema::getColumnListing($table);
		});
		return array_search($column, $columns) !== false;
	}

}