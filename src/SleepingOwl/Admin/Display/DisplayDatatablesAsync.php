<?php namespace SleepingOwl\Admin\Display;

use AdminTemplate;
use Carbon\Carbon;
use Input;
use Route;
use SleepingOwl\Admin\ColumnFilters\Date;
use SleepingOwl\Admin\Columns\Column\DateTime;
use SleepingOwl\Admin\Columns\Column\NamedColumn;
use SleepingOwl\Admin\Columns\Column\String;
use SleepingOwl\Admin\Interfaces\WithRoutesInterface;

class DisplayDatatablesAsync extends DisplayDatatables implements WithRoutesInterface
{

	/**
	 * Datatables name
	 * @var string
	 */
	protected $name;

	/**
	 * @param string|null $name
	 */
	function __construct($name = null)
	{
		$this->name($name);
	}

	/**
	 * Register display routes
	 */
	public static function registerRoutes()
	{
		Route::get('{adminModel}/async/{adminDisplayName?}', [
			'as' => 'admin.model.async',
			function ($model, $name = null)
			{
				$display = $model->display();
				if ($display instanceof DisplayTabbed)
				{
					$display = static::findDatatablesAsyncByName($display, $name);
				}
				if ($display instanceof DisplayDatatablesAsync)
				{
					return $display->renderAsync();
				}
				abort(404);
			}
		]);
	}

	/**
	 * Find DisplayDatatablesAsync in tabbed display by name
	 * @param DisplayTabbed $display
	 * @param string|null $name
	 * @return DisplayDatatablesAsync|null
	 */
	protected static function findDatatablesAsyncByName(DisplayTabbed $display, $name)
	{
		$tabs = $display->tabs();
		foreach ($tabs as $tab)
		{
			$content = $tab->getOriginalContent();
			if ($content instanceof DisplayDatatablesAsync && $content->name() === $name)
			{
				return $content;
			}
		}
		return null;
	}

	/**
	 * @return \Illuminate\View\View
	 */
	public function render()
	{
		$params = $this->getParams();
		$attributes = Input::all();
		array_unshift($attributes, $this->name());
		array_unshift($attributes, $this->model()->alias());
		$params['url'] = route('admin.model.async', $attributes);
		return view(AdminTemplate::view('display.datatablesAsync'), $params);
	}

	/**
	 * Render async request
	 * @return array
	 */
	public function renderAsync()
	{
		$query = $this->repository->query();
		$totalCount = $query->count();

		$this->modifyQuery($query);
		$this->applySearch($query);
		$this->applyColumnSearch($query);

		$filteredCount = $query->count();

		$this->applyOrders($query);
		$this->applyOffset($query);
		$collection = $query->get();

		return $this->prepareDatatablesStructure($collection, $totalCount, $filteredCount);
	}

	/**
	 * Apply offset and limit to the query
	 * @param $query
	 */
	protected function applyOffset($query)
	{
		$offset = Input::get('start', 0);
		$limit = Input::get('length', 10);
		if ($limit == -1)
		{
			return;
		}
		$query->offset($offset)->limit($limit);
	}

	/**
	 * Apply orders to the query
	 * @param $query
	 */
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

	/**
	 * Apply search to the query
	 * @param $query
	 */
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

	protected function applyColumnSearch($query)
	{
		$queryColumns = Input::get('columns', []);
		foreach ($queryColumns as $index => $queryColumn)
		{
			$search = array_get($queryColumn, 'search.value');
			$fullSearch = array_get($queryColumn, 'search');

			$column = array_get($this->columns(), $index);
			$columnFilter = array_get($this->columnFilters(), $index);
			if ( ! is_null($columnFilter))
			{
				$columnFilter->apply($this->repository, $column, $query, $search, $fullSearch);
			}
		}
	}

	/**
	 * Convert collection to the datatables structure
	 *
	 * @param $collection
	 * @param $totalCount
	 * @param $filteredCount
	 * @return array
	 */
	protected function prepareDatatablesStructure($collection, $totalCount, $filteredCount)
	{
		$columns = $this->allColumns();

		$result = [];
		$result['draw'] = Input::get('draw', 0);
		$result['recordsTotal'] = $totalCount;
		$result['recordsFiltered'] = $filteredCount;
		$result['data'] = [];
		foreach ($collection as $instance)
		{
			$_row = [];
			foreach ($columns as $column)
			{
				$column->setInstance($instance);
				$_row[] = (string)$column;
			}
			$result['data'][] = $_row;
		}
		return $result;
	}

	/**
	 * Get or set datatables name
	 * @param null $name
	 * @return $this
	 */
	public function name($name = null)
	{
		if (is_null($name))
		{
			return $this->name;
		}
		$this->name = $name;
		return $this;
	}

}