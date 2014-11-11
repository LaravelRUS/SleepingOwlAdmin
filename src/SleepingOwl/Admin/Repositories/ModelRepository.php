<?php namespace SleepingOwl\Admin\Repositories;

use Carbon\Carbon;
use Illuminate\Database\Query\Builder;
use SleepingOwl\Admin\Repositories\Interfaces\ModelRepositoryInterface;
use SleepingOwl\Admin\Models\ModelItem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use SleepingOwl\Models\Interfaces\ModelWithOrderFieldInterface;
use SleepingOwl\Models\Interfaces\ValidationModelInterface;

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
		/** @var Builder $query */
		$query = $this->instance->with($this->modelItem->getWith());
		$subtitle = $this->applyFilters($query);
		$totalCount = $query->count();
		if ( ! is_null($params))
		{
			$query->offset($params['offset']);
			$query->limit($params['limit']);
			$query->orderBy($params['orderBy'], $params['orderDest']);
		}
		$rows = $query->get();
		return compact('rows', 'subtitle', 'totalCount');
	}

	/**
	 * @param $query
	 * @return string
	 */
	protected function applyFilters($query)
	{
		$subtitles = $this->modelItem->applyFilters($query, $this->request->query());
		$subtitle = null;
		if (!empty($subtitles))
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
		$rules = $this->modelItem->getForm()->getValidationRules();
		$this->instance->validate($data = $this->request->all(), $rules);
		foreach ($data as &$value)
		{
			if ( ! is_string($value)) continue;
			if ((strpos($value, 'AM') !== false) || (strpos($value, 'PM') !== false))
			{
				$time = new Carbon($value);
				$value = $time->format('H:i:s');
			}
		}
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
		if (!is_null($id)) return $this->find($id);
		return $this->instance;
	}
}