<?php namespace SleepingOwl\Admin\Columns\Column;

use AdminTemplate;
use SleepingOwl\Admin\Admin;
use SleepingOwl\Admin\AssetManager\AssetManager;

class Control extends BaseColumn
{

	protected $view = 'control';

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

	protected function trashed()
	{
		if (method_exists($this->instance, 'trashed'))
		{
			return $this->instance->trashed();
		}
		return false;
	}

	protected function editable()
	{
		return ! $this->trashed() && ! is_null($this->model()->edit($this->instance->getKey()));
	}

	protected function editUrl()
	{
		return $this->model()->editUrl($this->instance->getKey());
	}

	protected function deletable()
	{
		return ! $this->trashed() && ! is_null($this->model()->delete($this->instance->getKey()));
	}

	protected function deleteUrl()
	{
		return $this->model()->deleteUrl($this->instance->getKey());
	}

	protected function restorable()
	{
		return $this->trashed() && ! is_null($this->model()->restore($this->instance->getKey()));
	}

	protected function restoreUrl()
	{
		return $this->model()->restoreUrl($this->instance->getKey());
	}

	public function render()
	{
		$params = [
			'editable'   => $this->editable(),
			'editUrl'    => $this->editUrl(),
			'deletable'  => $this->deletable(),
			'deleteUrl'  => $this->deleteUrl(),
			'restorable' => $this->restorable(),
			'restoreUrl' => $this->restoreUrl(),
		];
		return view(AdminTemplate::view('column.' . $this->view), $params);
	}

}