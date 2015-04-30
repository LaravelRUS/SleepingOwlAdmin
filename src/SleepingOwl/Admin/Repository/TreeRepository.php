<?php namespace SleepingOwl\Admin\Repository;

use Illuminate\Support\Collection;

class TreeRepository extends BaseRepository
{

	/**
	 * Extrepat/Baum tree type
	 * https://github.com/etrepat/baum
	 */
	const TreeTypeBaum = 0;
	/**
	 * Lasychaser/Laravel-nestedset tree type
	 * https://github.com/lazychaser/laravel-nestedset
	 */
	const TreeTypeKalnoy = 1;
	/**
	 * Simple tree type (with `parent_id` and `order` fields)
	 */
	const TreeTypeSimple = 2;

	/**
	 * Tree type
	 * @var int
	 */
	protected $type;
	/**
	 * Parent field name
	 * @var string
	 */
	protected $parentField = 'parent_id';
	/**
	 * Order field name
	 * @var string
	 */
	protected $orderField = 'order';
	/**
	 * Root parent id value
	 * @var null
	 */
	protected $rootParentId = null;

	/**
	 * @param string $class
	 */
	function __construct($class)
	{
		parent::__construct($class);

		$this->detectType();
	}

	/**
	 * Detect tree type
	 * @return $this
	 */
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

	/**
	 * Get tree structure
	 * @return mixed
	 */
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
		return null;
	}

	/**
	 * Reorder tree by $data value
	 * @param $data
	 */
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

	/**
	 * Recursive reoder simple tree type
	 * @param $data
	 * @param $parentId
	 */
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

	/**
	 * Recursive reorder nested-set tree type
	 * @param $root
	 * @param $parentId
	 * @param $left
	 * @return mixed
	 */
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

	/**
	 * Move tree node in nested-set tree type
	 * @param $id
	 * @param $parentId
	 * @param $left
	 * @param $right
	 */
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

	/**
	 * Get left column name
	 * @param $instance
	 * @return mixed
	 * @throws \Exception
	 */
	public function getLeftColumn($instance)
	{
		$methods = [
			'getLeftColumnName',
			'getLftName',
		];
		return $this->callMethods($instance, $methods);
	}

	/**
	 * Get right column name
	 * @param $instance
	 * @return mixed
	 * @throws \Exception
	 */
	public function getRightColumn($instance)
	{
		$methods = [
			'getRightColumnName',
			'getRgtName',
		];
		return $this->callMethods($instance, $methods);
	}

	/**
	 * Get parent column name
	 * @param $instance
	 * @return mixed
	 * @throws \Exception
	 */
	public function getParentColumn($instance)
	{
		$methods = [
			'getParentColumnName',
			'getParentIdName',
		];
		return $this->callMethods($instance, $methods);
	}

	/**
	 * Call several methods and get first result
	 * @param $instance
	 * @param $methods
	 * @return mixed
	 * @throws \Exception
	 */
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

	/**
	 * Get or set parent field name
	 * @param string|null $parentField
	 * @return $this|string
	 */
	public function parentField($parentField = null)
	{
		if (is_null($parentField))
		{
			return $this->parentField;
		}
		$this->parentField = $parentField;
		return $this;
	}

	/**
	 * Get or set order field name
	 * @param string|null $orderField
	 * @return $this|string
	 */
	public function orderField($orderField = null)
	{
		if (is_null($orderField))
		{
			return $this->orderField;
		}
		$this->orderField = $orderField;
		return $this;
	}

	/**
	 * Create simple tree type structure
	 * @return static
	 */
	protected function createSimpleTree()
	{
		$collection = $this->query()->orderBy($this->parentField(), 'asc')->orderBy($this->orderField(), 'asc')->get();

		$parent = $this->rootParentId();
		return $this->getChildren($collection, $parent);
	}

	/**
	 * Get children for simple tree type structure
	 * @param $collection
	 * @param $id
	 * @return static
	 */
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

	/**
	 * Get or set tree type
	 * @param int|null $type
	 * @return $this|int
	 */
	public function type($type = null)
	{
		if (is_null($type))
		{
			return $this->type;
		}
		$this->type = $type;
		return $this;
	}

	/**
	 * Get or set parent field name
	 * @param string|null $rootParentId
	 * @return $this|string
	 */
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