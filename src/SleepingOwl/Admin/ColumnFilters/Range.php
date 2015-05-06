<?php namespace SleepingOwl\Admin\ColumnFilters;

use SleepingOwl\Admin\AssetManager\AssetManager;

class Range extends BaseColumnFilter
{

	protected $view = 'range';
	protected $from;
	protected $to;

	/**
	 * Initialize column filter
	 */
	public function initialize()
	{
		parent::initialize();

		AssetManager::addScript('admin::default/js/columnfilters/range.js');

		$this->from()->initialize();
		$this->to()->initialize();
	}

	public function from($from = null)
	{
		if (is_null($from))
		{
			return $this->from;
		}
		$this->from = $from;
		return $this;
	}

	public function to($to = null)
	{
		if (is_null($to))
		{
			return $this->to;
		}
		$this->to = $to;
		return $this;
	}

	protected function getParams()
	{
		return parent::getParams() + [
			'from' => $this->from(),
			'to' => $this->to(),
		];
	}

	public function apply($repository, $column, $query, $search, $fullSearch, $operator = '=')
	{
		$from = array_get($fullSearch, 'from');
		$to = array_get($fullSearch, 'to');
		if ( ! empty($from))
		{
			$this->from()->apply($repository, $column, $query, $from, $fullSearch, '>=');
		}
		if ( ! empty($to))
		{
			$this->to()->apply($repository, $column, $query, $to, $fullSearch, '<=');
		}
	}

}