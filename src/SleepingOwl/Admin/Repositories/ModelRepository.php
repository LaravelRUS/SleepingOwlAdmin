<?php namespace SleepingOwl\Admin\Repositories;

use Cache;
use Carbon\Carbon;
use DB;
use Doctrine\DBAL\Schema\Column;
use Illuminate\Database\Query\Builder;
use SleepingOwl\Admin\Columns\Interfaces\ColumnInterface;
use SleepingOwl\Admin\Repositories\Interfaces\ModelRepositoryInterface;
use SleepingOwl\Admin\Models\ModelItem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use SleepingOwl\Models\Interfaces\ModelWithOrderFieldInterface;
use SleepingOwl\Models\Interfaces\ValidationModelInterface;
use SleepingOwl\WithJoin\WithJoinEloquentBuilder;

class ModelRepository implements ModelRepositoryInterface
{
	/**
	 * @var ModelItem
	 */
	protected $modelItem;
	/**
	 * @var Model|ValidationModelInterface|ModelWithOrderFieldInterface
	 */
	protected $instance;
	/**
	 * @var Request
	 */
	protected $request;

	/**
	 * @param ModelItem $modelItem
	 * @param Request $request
	 */
	function __construct(ModelItem $modelItem, Request $request)
	{
		$this->modelItem = $modelItem;
		$this->request = $request;
		$modelClass = $this->modelItem->getModelClass();
		$this->instance = new $modelClass;
	}

	/**
	 * @param $id
	 * @return Model|ValidationModelInterface|ModelWithOrderFieldInterface
	 */
	public function find($id)
	{
		return $this->instance->findOrFail($id);
	}

	/**
	 * @param null $params
	 * @return array
	 */
	public function tableData($params = null)
	{
		$with = $this->modelItem->getWith();
		if ($this->modelItem->isWithJoinEnabled())
		{
			$baseQuery = $this->instance->newQuery()->getQuery();
			/** @var WithJoinEloquentBuilder $query */
			$query = new WithJoinEloquentBuilder($baseQuery);
			if ($this->modelItem->isAsync())
			{
				$query->references($with);
			}
		} else
		{
			$query = $this->instance->newQuery();
		}
		$query->setModel($this->instance)->with($with);
		$query = $this->instance->applyGlobalScopes($query);
		$query->getQuery()->orders = null;
		$this->applyFilters($query);
		$totalCount = $query->count();
		if ( ! is_null($params))
		{
			if (trim($params['search']) != '')
			{
				$search = '%' . $params['search'] . '%';
				$this->addSearchToQuery($query, $search);
			}
			if ($params['limit'] != -1)
			{
				$query->offset($params['offset']);
				$query->limit($params['limit']);
			}
			$query->orderBy($params['orderBy'], $params['orderDest']);
		}
		$rows = $query->get();
		return compact('rows', 'totalCount');
	}

	/**
	 * @return string
	 */
	public function getSubtitle()
	{
		$query = $this->instance->newQuery();
		return $this->applyFilters($query);
	}

	/**
	 * @param $query
	 * @return string
	 */
	protected function applyFilters($query)
	{
		$subtitles = $this->modelItem->applyFilters($query, $this->request->query());
		$subtitle = null;
		if ( ! empty($subtitles))
		{
			$subtitle = implode(', ', $subtitles);
			return $subtitle;
		}
		return $subtitle;
	}

	/**
	 *
	 */
	public function store()
	{
		$this->save();
	}

	/**
	 * @param $id
	 * @return void
	 */
	public function update($id)
	{
		$this->instance = $this->find($id);
		$this->save();
	}

	/**
	 *
	 */
	protected function save()
	{
		$data = $this->request->all();
		$this->modelItem->getForm()->updateRequestData($data);

		$rules = $this->modelItem->getForm()->getValidationRules();
		$this->instance->validate($data, $rules);

		$this->instance->fill($data);

		$this->instance->save();
	}

	/**
	 * @param $id
	 * @return void
	 */
	public function moveUp($id)
	{
		$this->find($id)->moveUp();
	}

	/**
	 * @param $id
	 * @return void
	 */
	public function moveDown($id)
	{
		$this->find($id)->moveDown();
	}

	/**
	 * @param $id
	 * @throws \Exception
	 */
	public function destroy($id)
	{
		$this->find($id)->delete();
	}

	/**
	 * @param $id
	 * @return ModelWithOrderFieldInterface|ValidationModelInterface|Model
	 */
	public function getInstance($id = null)
	{
		if ( ! is_null($id)) return $this->find($id);
		return $this->instance;
	}

	/**
	 * @param WithJoinEloquentBuilder $originalQuery
	 * @param $search
	 * @internal param $query
	 */
	protected function addSearchToQuery(WithJoinEloquentBuilder $originalQuery, $search)
	{
		$originalQuery->getQuery()->whereNested(function (Builder $query) use ($search, $originalQuery)
		{
			$table = $this->instance->getTable();
			$columns = $this->getColumns($table);
			foreach ($columns as $column => $type)
			{
				$field = implode('.', [
					$table,
					$column
				]);
				if ($this->isDateColumn($type))
				{
					$field = DB::raw('convert(' . $field . ' using utf8)');
				}
				$query->orWhere($field, 'like', $search);
			}

			/** @var ColumnInterface[] $displayColumns */
			$displayColumns = $this->modelItem->getColumns();
			foreach ($displayColumns as $column)
			{
				$name = $column->getName();
				if (strpos($name, '.') !== false && $this->inWith($name, $originalQuery) && $this->modelItem->isWithJoinEnabled())
				{
					$query->orWhere($name, 'like', $search);
				}
			}
		});
	}

	/**
	 * @param $name
	 * @param WithJoinEloquentBuilder $query
	 * @return bool
	 */
	protected function inWith($name, WithJoinEloquentBuilder $query)
	{
		$eagerLoads = $this->modelItem->getWith();
		foreach ($eagerLoads as $with)
		{
			if (strpos($name, $with) !== 0) continue;

			$relation = $this->instance->$with();
			if ($query->isRelationSupported($relation))
			{
				return true;
			}
		}
		return false;
	}

	/**
	 * @param $table
	 * @return array
	 */
	protected function getColumns($table)
	{
		$cacheKey = '_admin_columns_cache_' . $table;
		if ($columns = Cache::get($cacheKey))
		{
			return $columns;
		}
		$columnsFull = DB::getDoctrineSchemaManager()->listTableColumns($table);
		$columns = array_map(function (Column $column)
		{
			return $column->getType()->getName();
		}, $columnsFull);
		Cache::put($cacheKey, $columns, 1440);
		return $columns;
	}

	/**
	 * @param $type
	 * @return bool
	 */
	protected function isDateColumn($type)
	{
		return in_array($type, [
			'date',
			'datetime'
		]);
	}
}