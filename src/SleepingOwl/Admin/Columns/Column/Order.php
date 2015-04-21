<?php namespace SleepingOwl\Admin\Columns\Column;

use AdminTemplate;
use Route;
use SleepingOwl\Admin\Interfaces\WithRoutesInterface;

class Order extends BaseColumn implements WithRoutesInterface
{

	public function initialize()
	{
		parent::initialize();
	}

	public static function registerRoutes()
	{
		Route::post('{adminModel}/{adminModelId}/up', [
			'as' => 'admin.model.move-up',
			function ($model, $id)
			{
				$instance = $model->repository()->find($id);
				$instance->moveUp();
				return back();
			}
		]);
		Route::post('{adminModel}/{adminModelId}/down', [
			'as' => 'admin.model.move-down',
			function ($model, $id)
			{
				$instance = $model->repository()->find($id);
				$instance->moveDown();
				return back();
			}
		]);
	}

	protected function orderValue()
	{
		return $this->instance->getOrderValue();
	}

	protected function totalCount()
	{
		return $this->model()->repository()->query()->count();
	}

	protected function movableUp()
	{
		return $this->orderValue() > 0;
	}

	protected function moveUpUrl()
	{
		return route('admin.model.move-up', [
			$this->model()->alias(),
			$this->instance->getKey()
		]);
	}

	protected function movableDown()
	{
		return $this->orderValue() < $this->totalCount() - 1;
	}

	protected function moveDownUrl()
	{
		return route('admin.model.move-down', [
			$this->model()->alias(),
			$this->instance->getKey()
		]);
	}

	public function render()
	{
		$params = [
			'movableUp'   => $this->movableUp(),
			'moveUpUrl'   => $this->moveUpUrl(),
			'movableDown' => $this->movableDown(),
			'moveDownUrl' => $this->moveDownUrl(),
		];
		return view(AdminTemplate::view('column.order'), $params);
	}
}