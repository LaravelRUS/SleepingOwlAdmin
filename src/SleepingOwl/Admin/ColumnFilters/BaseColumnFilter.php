<?php namespace SleepingOwl\Admin\ColumnFilters;

use AdminTemplate;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\AssetManager\AssetManager;
use SleepingOwl\Admin\Helpers\ExceptionHandler;
use SleepingOwl\Admin\Interfaces\ColumnFilterInterface;

abstract class BaseColumnFilter implements Renderable, ColumnFilterInterface
{

	protected $view;

	/**
	 * Initialize column filter
	 */
	public function initialize()
	{
		AssetManager::addScript('admin::default/js/columnfilters/base.js');
	}


	protected function getParams()
	{
		return [];
	}

	public function render()
	{
		$params = $this->getParams();
		return view(AdminTemplate::view('columnfilter.' . $this->view), $params);
	}

	/**
	 * @return string
	 */
	function __toString()
	{
		try
		{
			return (string)$this->render();
		} catch (\Exception $e)
		{
			ExceptionHandler::handle($e);
		}
	}

} 