<?php namespace SleepingOwl\Admin\Filter;

use Illuminate\Database\Eloquent\ModelNotFoundException;

class FilterRelated extends FilterBase
{

	protected $display = 'title';
	protected $model;

	public function display($display = null)
	{
		if (is_null($display))
		{
			return $this->display;
		}
		$this->display = $display;
		return $this;
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

	public function title($title = null)
	{
		$parent = parent::title($title);
		if (is_null($parent))
		{
			return $this->getDisplayField();
		}
		return $parent;
	}

	protected function getDisplayField()
	{
		$model = $this->model();
		if (is_null($model))
		{
			throw new \Exception('Specify model for filter: ' . $this->name());
		}
		try
		{
			$instance = app($model)->findOrFail($this->value());
			return $instance->{$this->display()};
		} catch (ModelNotFoundException $e)
		{
		}
		return null;
	}

}