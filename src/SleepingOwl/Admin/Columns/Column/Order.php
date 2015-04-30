<?php namespace SleepingOwl\Admin\Columns\Column;

use AdminTemplate;
use Illuminate\View\View;
use Route;
use SleepingOwl\Admin\Interfaces\WithRoutesInterface;

class Order extends BaseColumn implements WithRoutesInterface
{

	/**
	 * Register routes
	 */
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

	/**
	 * Get order value from instance
	 * @return int
	 */
	protected function orderValue()
	{
		return $this->instance->getOrderValue();
	}

	/**
	 * Get models total count
	 * @return int
	 */
	protected function totalCount()
	{
		return $this->model()->repository()->query()->count();
	}

	/**
	 * Check if instance is movable up
	 * @return bool
	 */
	protected function movableUp()
	{
		return $this->orderValue() > 0;
	}

	/**
	 * Get instance move up url
	 * @return Route
	 */
	protected function moveUpUrl()
	{
		return route('admin.model.move-up', [
			$this->model()->alias(),
			$this->instance->getKey()
		]);
	}

	/**
	 * Check if instance is movable down
	 * @return bool
	 */
	protected function movableDown()
	{
		return $this->orderValue() < $this->totalCount() - 1;
	}

	/**
	 * Get instance move down url
	 * @return Route
	 */
	protected function moveDownUrl()
	{
		return route('admin.model.move-down', [
			$this->model()->alias(),
			$this->instance->getKey()
		]);
	}

	/**
	 * @return View
	 */
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