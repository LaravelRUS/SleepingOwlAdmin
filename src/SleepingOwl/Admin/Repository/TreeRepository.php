<?php namespace SleepingOwl\Admin\Repository;

class TreeRepository extends BaseRepository
{

	public function tree()
	{
		$collection = $this->query()->get();
		if (method_exists($collection, 'toHierarchy'))
		{
			return $collection->toHierarchy();
		} elseif (method_exists($collection, 'toTree'))
		{
			return $collection->toTree();
		} else
		{
			throw new \Exception('Tree type not supported');
		}
	}

	public function reorder($data)
	{
		$left = 1;
		foreach ($data as $root)
		{
			$left = $this->recursiveReorder($root, null, $left);
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

} 