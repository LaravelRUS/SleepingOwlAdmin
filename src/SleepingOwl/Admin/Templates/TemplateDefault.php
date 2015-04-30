<?php namespace SleepingOwl\Admin\Templates;

use SleepingOwl\Admin\AssetManager\AssetManager;
use SleepingOwl\Admin\Interfaces\TemplateInterface;

class TemplateDefault implements TemplateInterface
{

	/**
	 *
	 */
	function __construct()
	{
		AssetManager::addStyle('admin::default/css/bootstrap.min.css');
		AssetManager::addStyle('admin::default/css/sb-admin-2.css');
		AssetManager::addStyle('admin::default/css/font-awesome.min.css');

		AssetManager::addScript(route('admin.lang'));
		AssetManager::addScript('admin::default/js/jquery-1.11.0.js');
		AssetManager::addScript('admin::default/js/bootstrap.min.js');
		AssetManager::addScript('admin::default/js/sb-admin-2.js');
		AssetManager::addScript('admin::default/js/metisMenu.min.js');
		AssetManager::addScript('admin::default/js/admin-default.js');
	}

	/**
	 * Get full view name
	 * @param string $view
	 * @return string
	 */
	public function view($view)
	{
		return 'admin::default.' . $view;
	}

}