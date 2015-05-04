<?php namespace SleepingOwl\Admin\Display;

use SleepingOwl\Admin\AssetManager\AssetManager;
use SleepingOwl\Admin\Interfaces\ColumnFilterInterface;

class DisplayDatatables extends DisplayTable
{

	/**
	 * View to render
	 * @var string
	 */
	protected $view = 'datatables';
	/**
	 * Datatables order
	 * @var array
	 */
	protected $order = [
		[
			0,
			'asc'
		]
	];
	protected $columnFilters = [];
	protected $attributes = [];

	/**
	 * Initialize display
	 */
	public function initialize()
	{
		parent::initialize();

		foreach ($this->columnFilters() as $columnFilter)
		{
			if ($columnFilter instanceof ColumnFilterInterface)
			{
				$columnFilter->initialize();
			}
		}

		AssetManager::addScript('admin::default/js/datatables/jquery.dataTables.min.js');
		AssetManager::addScript('admin::default/js/datatables/jquery.dataTables_bootstrap.js');
		AssetManager::addScript('admin::default/js/notify-combined.min.js');
		AssetManager::addScript('admin::default/js/datatables/init.js');

		AssetManager::addStyle('admin::default/css/dataTables.bootstrap.css');
	}

	public function columnFilters($columnFilters = null)
	{
		if (is_null($columnFilters))
		{
			return $this->columnFilters;
		}
		$this->columnFilters = $columnFilters;
		return $this;
	}

	public function attributes($attributes = null)
	{
		if (is_null($attributes))
		{
			return $this->attributes;
		}
		$this->attributes = $attributes;
		return $this;
	}

	/**
	 * Set or get datatables order
	 * @param array|null $order
	 * @return $this|array
	 */
	public function order($order = null)
	{
		if (is_null($order))
		{
			return $this->order;
		}
		$this->order = $order;
		return $this;
	}

	/**
	 * Get view render parameters
	 * @return array
	 */
	protected function getParams()
	{
		$params = parent::getParams();
		$params['order'] = $this->order();
		$params['columnFilters'] = $this->columnFilters();
		$params['attributes'] = $this->attributes();
		return $params;
	}

}