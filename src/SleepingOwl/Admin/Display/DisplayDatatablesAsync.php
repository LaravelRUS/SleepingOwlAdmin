<?php namespace SleepingOwl\Admin\Display;

use AdminTemplate;
use Input;
use Route;
use SleepingOwl\Admin\Columns\Column\NamedColumn;
use SleepingOwl\Admin\Columns\Column\String;
use SleepingOwl\Admin\Interfaces\WithRoutesInterface;

class DisplayDatatablesAsync extends DisplayDatatables implements WithRoutesInterface
{

	public static function registerRoutes()
	{
		Route::get('{adminModel}/async', [
			'as' => 'admin.model.async',
			function ($model)
			{
				$display = $model->display();
				if ($display instanceof DisplayDatatablesAsync)
				{
					return $display->renderAsync();
				}
				abort(404);
			}
		]);
	}

	public function render()
	{
		$params = $this->getParams();
		$attributes = Input::all();
		array_unshift($attributes, $this->model()->alias());
		$params['url'] = route('admin.model.async', $attributes);
		return view(AdminTemplate::view('display.datatablesAsync'), $params);
	}

	public function renderAsync()
	{
		$query = $this->repository->query();
		$totalCount = $query->count();

		$this->modifyQuery($query);
		$this->applySearch($query);

		$filteredCount = $query->count();

		$this->applyOrders($query);
		$this->applyOffset($query);
		$collection = $query->get();

		return $this->prepareDatatablesStructure($collection, $totalCount, $filteredCount);
	}

	protected function applyOffset($query)
	{
		$offset = Input::get('start', 0);
		$limit = Input::get('length', 10);
		$query->offset($offset)->limit($limit);
	}

	protected function applyOrders($query)
	{
		$orders = Input::get('order', []);
		foreach ($orders as $order)
		{
			$columnIndex = $order['column'];
			$orderDirection = $order['dir'];
			$column = $this->allColumns()[$columnIndex];
			if ($column instanceof NamedColumn && $column->isOrderable())
			{
				$name = $column->name();
				$query->orderBy($name, $orderDirection);
			}
		}
	}

	protected function applySearch($query)
	{
		$search = Input::get('search.value');
		if (is_null($search))
		{
			return;
		}

		$query->where(function ($query) use ($search)
		{
			$columns = $this->columns();
			foreach ($columns as $column)
			{
				if ($column instanceof String)
				{
					$name = $column->name();
					if ($this->repository->hasColumn($name))
					{
						$query->orWhere($name, 'like', '%' . $search . '%');
					}
				}
			}
		});
	}

	protected function prepareDatatablesStructure($collection, $totalCount, $filteredCount)
	{
		$columns = $this->allColumns();

		$result = [];
		$result['draw'] = Input::get('draw');
		$result['recordsTotal'] = $totalCount;
		$result['recordsFiltered'] = $filteredCount;
		$result['data'] = [];
		foreach ($collection as $instance)
		{
			$_row = [];
			foreach ($columns as $column)
			{
				$column->setInstance($instance);
				$_row[] = (string) $column;
			}
			$result['data'][] = $_row;
		}
		return $result;
	}

}