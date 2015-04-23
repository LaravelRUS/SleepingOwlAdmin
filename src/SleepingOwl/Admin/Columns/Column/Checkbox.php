<?php namespace SleepingOwl\Admin\Columns\Column;

use AdminTemplate;
use SleepingOwl\Admin\Admin;
use SleepingOwl\Admin\AssetManager\AssetManager;

class Checkbox extends BaseColumn
{

	protected $view = 'checkbox';

	public function initialize()
	{
		parent::initialize();

		AssetManager::addScript('admin::default/js/columns/checkbox.js');
	}

	function __construct()
	{
		parent::__construct();

		$this->label('<input type="checkbox" class="adminCheckboxAll"/>');
		$this->orderable(false);
	}

	public function render()
	{
		$params = [
			'value' => $this->instance->getKey(),
		];
		return view(AdminTemplate::view('column.' . $this->view), $params);
	}

}