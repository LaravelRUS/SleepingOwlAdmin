<?php namespace SleepingOwl\Admin\Columns\Column;

use AdminTemplate;
use SleepingOwl\Admin\AssetManager\AssetManager;

class Image extends NamedColumn
{

	public function initialize()
	{
		parent::initialize();

		AssetManager::addStyle('admin::default/css/ekko-lightbox.min.css');
		AssetManager::addScript('admin::default/js/ekko-lightbox.min.js');
		AssetManager::addScript('admin::default/js/columns/image.js');
	}

	function __construct($name)
	{
		parent::__construct($name);
		$this->orderable(false);
	}

	public function render()
	{
		$value = $this->getValue($this->instance, $this->name());
		if ( ! empty($value) && (strpos($value, '://') === false))
		{
			$value = asset($value);
		}
		$params = [
			'value'  => $value,
			'append' => $this->append(),
		];
		return view(AdminTemplate::view('column.image'), $params);
	}

}