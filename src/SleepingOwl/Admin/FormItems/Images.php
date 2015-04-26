<?php namespace SleepingOwl\Admin\FormItems;

use Input;
use SleepingOwl\Admin\AssetManager\AssetManager;

class Images extends Image
{

	protected $view = 'images';

	public function initialize()
	{
		AssetManager::addScript('admin::default/js/formitems/image/initMultiple.js');
		AssetManager::addScript('admin::default/js/formitems/image/flow.min.js');
	}

	public function save()
	{
		$name = $this->name();
		$value = Input::get($name, '');
		if ( ! empty($value))
		{
			$value = explode(',', $value);
		} else
		{
			$value = [];
		}
		Input::merge([$name => $value]);
		parent::save();
	}

	public function value()
	{
		$value = parent::value();
		if (is_null($value))
		{
			$value = [];
		}
		return $value;
	}

}