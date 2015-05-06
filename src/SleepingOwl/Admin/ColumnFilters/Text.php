<?php namespace SleepingOwl\Admin\ColumnFilters;

use SleepingOwl\Admin\AssetManager\AssetManager;

class Text extends BaseColumnFilter
{

	protected $view = 'text';
	protected $placeholder;

	/**
	 * Initialize column filter
	 */
	public function initialize()
	{
		parent::initialize();

		AssetManager::addScript('admin::default/js/columnfilters/text.js');
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

	protected function getParams()
	{
		return parent::getParams() + [
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