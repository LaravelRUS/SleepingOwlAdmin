<?php namespace SleepingOwl\Admin\ColumnFilters;

use AdminTemplate;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\AssetManager\AssetManager;
use SleepingOwl\Admin\Interfaces\ColumnFilterInterface;

class Text implements Renderable, ColumnFilterInterface
{

	protected $placeholder;

	/**
	 * Initialize column filter
	 */
	public function initialize()
	{
		AssetManager::addScript('admin::default/js/columnfilters/base.js');
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

	public function render()
	{
		$params = [
			'placeholder' => $this->placeholder(),
		];
		return view(AdminTemplate::view('columnfilter.text'), $params);
	}

	/**
	 * @return string
	 */
	function __toString()
	{
		return (string)$this->render();
	}

} 