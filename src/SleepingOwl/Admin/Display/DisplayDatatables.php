<?php namespace SleepingOwl\Admin\Display;

use SleepingOwl\Admin\AssetManager\AssetManager;

class DisplayDatatables extends DisplayTable
{

	protected $view = 'datatables';
	protected $order = [[0, 'asc']];

	public function initialize()
	{
		parent::initialize();

		AssetManager::addScript('admin::default/js/datatables/jquery.dataTables.min.js');
		AssetManager::addScript('admin::default/js/datatables/jquery.dataTables_bootstrap.js');
		AssetManager::addScript('admin::default/js/datatables/init.js');

		AssetManager::addStyle('admin::default/css/dataTables.bootstrap.css');
	}

	public function order($order = null)
	{
		if (is_null($order))
		{
			return $this->order;
		}
		$this->order = $order;
		return $this;
	}

	protected function getParams()
	{
		$params = parent::getParams();
		$params['order'] = $this->order();
		return $params;
	}

}