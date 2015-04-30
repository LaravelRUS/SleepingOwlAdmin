<?php namespace SleepingOwl\Admin\Repository;

use Cache;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\SoftDeletes;
use Schema;

class BaseRepository
{

	/**
	 * Repository related class name
	 * @var string
	 */
	protected $class;
	/**
	 * Repository related model instance
	 * @var mixed
	 */
	protected $model;
	/**
	 * Eager loading relations
	 * @var string[]
	 */
	protected $with = [];

	/**
	 * @param string $class
	 */
	function __construct($class)
	{
		$this->class = $class;
		$this->model(app($this->class));
	}

	/**
	 * Get or set eager loading relations
	 * @param string|string[]|null $with
	 * @return $this|string[]
	 */
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

	/**
	 * Get base query
	 * @return mixed
	 */
	public function query()
	{
		$query = $this->model->query();
		$query->with($this->with());
		return $query;
	}

	/**
	 * Find model instance by id
	 * @param int $id
	 * @return mixed
	 */
	public function find($id)
	{
		return $this->model->find($id);
	}

	/**
	 * Find model instances by ids
	 * @param int[] $ids
	 * @return mixed
	 */
	public function findMany($ids)
	{
		$query = $this->model->query();
		if (method_exists($this->model, 'withTrashed'))
		{
			$query->withTrashed();
		}
		return $query->whereIn($this->model->getKeyName(), $ids)->get();
	}

	/**
	 * Delete model instance by id
	 * @param int $id
	 */
	public function delete($id)
	{
		$this->find($id)->delete();
	}

	/**
	 * Restore model instance by id
	 * @param int $id
	 */
	public function restore($id)
	{
		$this->query()->onlyTrashed()->find($id)->restore();
	}

	/**
	 * Get or set repository related model intance
	 * @param mixed|null $model
	 * @return $this|mixed
	 */
	public function model($model = null)
	{
		if (is_null($model))
		{
			return $this->model;
		}
		$this->model = $model;
		return $this;
	}

	/**
	 * Check if model's table has column
	 * @param string $column
	 * @return bool
	 */
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