<?php namespace SleepingOwl\Admin\Repository;

use Illuminate\Support\Collection;

class TreeRepository extends BaseRepository
{

	const TreeTypeBaum = 0;
	const TreeTypeKalnoy = 1;
	const TreeTypeSimple = 2;

	protected $type;
	protected $parentField = 'parent_id';
	protected $orderField = 'order';
	protected $rootParentId = null;

	function __construct($class)
	{
		parent::__construct($class);

		$this->detectType();
	}

	protected function detectType()
	{
		if ($this->model() instanceof \Baum\Node)
		{
			return $this->type(static::TreeTypeBaum);
		}
		if ($this->model() instanceof \Kalnoy\Nestedset\Node)
		{
			return $this->type(static::TreeTypeKalnoy);
		}
		return $this->type(static::TreeTypeSimple);
	}

	public function tree()
	{
		$collection = $this->query()->get();
		switch ($this->type())
		{
			case static::TreeTypeBaum:
				return $collection->toHierarchy();
				break;
			case static::TreeTypeKalnoy:
				return $collection->toTree();
				break;
			case static::TreeTypeSimple:
				return $this->createSimpleTree();
				break;
		}
	}

	public function reorder($data)
	{
		if ($this->type() == static::TreeTypeSimple)
		{
			$this->recursiveReorderSimple($data, $this->rootParentId());
		} else
		{
			$left = 1;
			foreach ($data as $root)
			{
				$left = $this->recursiveReorder($root, null, $left);
			}
		}
	}

	protected function recursiveReorderSimple($data, $parentId)
	{
		foreach ($data as $order => $item)
		{
			$id = $item['id'];

			$instance = $this->find($id);
			$instance->{$this->parentField()} = $parentId;
			$instance->{$this->orderField()} = $order;
			$instance->save();

			if (isset($item['children']))
			{
				$this->recursiveReorderSimple($item['children'], $id);
			}
		}
	}

	protected function recursiveReorder($root, $parentId, $left)
	{
		$right = $left + 1;
		$children = array_get($root, 'children', []);
		foreach ($children as $child)
		{
			$right = $this->recursiveReorder($child, $root['id'], $right);
		}
		$this->move($root['id'], $parentId, $left, $right);
		$left = $right + 1;
		return $left;
	}

	public function move($id, $parentId, $left, $right)
	{
		$instance = $this->find($id);
		$attributes = $instance->getAttributes();
		$attributes[$this->getLeftColumn($instance)] = $left;
		$attributes[$this->getRightColumn($instance)] = $right;
		$attributes[$this->getParentColumn($instance)] = $parentId;
		$instance->setRawAttributes($attributes);
		$instance->save();
	}

	public function getLeftColumn($instance)
	{
		$methods = [
			'getLeftColumnName',
			'getLftName',
		];
		return $this->callMethods($instance, $methods);
	}

	public function getRightColumn($instance)
	{
		$methods = [
			'getRightColumnName',
			'getRgtName',
		];
		return $this->callMethods($instance, $methods);
	}

	public function getParentColumn($instance)
	{
		$methods = [
			'getParentColumnName',
			'getParentIdName',
		];
		return $this->callMethods($instance, $methods);
	}

	protected function callMethods($instance, $methods)
	{
		foreach ($methods as $method)
		{
			if (method_exists($instance, $method))
			{
				return $instance->$method();
			}
		}
		throw new \Exception('Tree type not supported');
	}

	public function parentField($parentField = null)
	{
		if (is_null($parentField))
		{
			return $this->parentField;
		}
		$this->parentField = $parentField;
		return $this;
	}

	public function orderField($orderField = null)
	{
		if (is_null($orderField))
		{
			return $this->orderField;
		}
		$this->orderField = $orderField;
		return $this;
	}

	protected function createSimpleTree()
	{
		$collection = $this->query()->orderBy($this->parentField(), 'asc')->orderBy($this->orderField(), 'asc')->get();

		$parent = $this->rootParentId();
		return $this->getChildren($collection, $parent);
	}

	protected function getChildren($collection, $id)
	{
		$parentField = $this->parentField();
		$result = [];
		foreach ($collection as $instance)
		{
			if ($instance->$parentField != $id) continue;

			$instance->setRelation('children', $this->getChildren($collection, $instance->getKey()));
			$result[] = $instance;
		}
		return Collection::make($result);
	}

	public function type($type = null)
	{
		if (is_null($type))
		{
			return $this->type;
		}
		$this->type = $type;
		return $this;
	}

	public function rootParentId($rootParentId = null)
	{
		if (func_num_args() == 0)
		{
			return $this->rootParentId;
		}
		$this->rootParentId = $rootParentId;
		return $this;
	}

}