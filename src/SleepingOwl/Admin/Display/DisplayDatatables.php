<?php namespace SleepingOwl\Admin\Display;

use SleepingOwl\Admin\AssetManager\AssetManager;

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
	protected $order = [[0, 'asc']];

	/**
	 * Initialize display
	 */
	public function initialize()
	{
		parent::initialize();

		AssetManager::addScript('admin::default/js/datatables/jquery.dataTables.min.js');
		AssetManager::addScript('admin::default/js/datatables/jquery.dataTables_bootstrap.js');
		AssetManager::addScript('admin::default/js/notify-combined.min.js');
		AssetManager::addScript('admin::default/js/datatables/init.js');

		AssetManager::addStyle('admin::default/css/dataTables.bootstrap.css');
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
		return $params;
	}

}