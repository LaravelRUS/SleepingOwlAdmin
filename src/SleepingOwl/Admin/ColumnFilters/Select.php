<?php namespace SleepingOwl\Admin\ColumnFilters;

use SleepingOwl\Admin\AssetManager\AssetManager;
use SleepingOwl\Admin\Repository\BaseRepository;

class Select extends BaseColumnFilter
{

	protected $view = 'select';
	protected $model;
	protected $display = 'title';
	protected $options = [];
	protected $placeholder;

	/**
	 * Initialize column filter
	 */
	public function initialize()
	{
		parent::initialize();

		AssetManager::addScript('admin::default/js/columnfilters/select.js');
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

	public function display($display = null)
	{
		if (is_null($display))
		{
			return $this->display;
		}
		$this->display = $display;
		return $this;
	}

	public function options($options = null)
	{
		if (is_null($options))
		{
			if ( ! is_null($this->model()) && ! is_null($this->display()))
			{
				$this->loadOptions();
			}
			$options = $this->options;
			asort($options);
			return $options;
		}
		$this->options = $options;
		return $this;
	}

	protected function loadOptions()
	{
		$repository = new BaseRepository($this->model());
		$key = $repository->model()->getKeyName();
		$options = $repository->query()->get()->lists($this->display(), $key);
		$options = array_unique($options);
		$this->options($options);
	}

	public function placeholder($placeholder = null)
	{
		if (is_null($placeholder))
		{
			return $this->placeholder;
		}
		$this->placeholder = $placeholder;
		return $this;
	}

	public function getParams()
	{
		return parent::getParams() + [
			'options'     => $this->options(),
			'placeholder' => $this->placeholder(),
		];
	}

	public function apply($repository, $column, $query, $search, $fullSearch, $operator = 'like')
	{
		if (empty($search)) return;

		if ($operator == 'like')
		{
			$search = '%' . $search . '%';
		}

		$name = $column->name();
		if ($repository->hasColumn($name))
		{
			$query->where($name, $operator, $search);
		} elseif (strpos($name, '.') !== false)
		{
			$parts = explode('.', $name);
			$fieldName = array_pop($parts);
			$relationName = implode('.', $parts);
			$query->whereHas($relationName, function ($q) use ($search, $fieldName, $operator)
			{
				$q->where($fieldName, $operator, $search);
			});
		}
	}

} 