<?php namespace SleepingOwl\Admin\Repository;

use Illuminate\Database\Eloquent\ModelNotFoundException;

class BaseRepository
{

	protected $class;

	protected $model;

	protected $with = [];

	function __construct($class)
	{
		$this->class = $class;
		$this->model = app($this->class);
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

	public function delete($id)
	{
		$this->find($id)->delete();
	}

}