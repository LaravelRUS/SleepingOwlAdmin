<?php namespace SleepingOwl\Admin\Columns\Column;

use AdminTemplate;
use SleepingOwl\Admin\Admin;
use SleepingOwl\Admin\AssetManager\AssetManager;

class Control extends BaseColumn
{

	public function initialize()
	{
		parent::initialize();
		AssetManager::addScript('admin::default/js/bootbox.js');
		AssetManager::addScript('admin::default/js/columns/control.js');
	}

	protected function model()
	{
		return Admin::model(get_class($this->instance));
	}

	protected function editable()
	{
		return ! is_null($this->model()->edit($this->instance->getKey()));
	}

	protected function editUrl()
	{
		return $this->model()->editUrl($this->instance->getKey());
	}

	protected function deletable()
	{
		return ! is_null($this->model()->delete($this->instance->getKey()));
	}

	protected function deleteUrl()
	{
		return $this->model()->deleteUrl($this->instance->getKey());
	}

	public function render()
	{
		$params = [
			'editable'  => $this->editable(),
			'editUrl'   => $this->editUrl(),
			'deletable' => $this->deletable(),
			'deleteUrl' => $this->deleteUrl(),
		];
		return view(AdminTemplate::view('column.control'), $params);
	}

}