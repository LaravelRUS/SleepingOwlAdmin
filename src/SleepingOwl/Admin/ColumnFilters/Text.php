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

} 