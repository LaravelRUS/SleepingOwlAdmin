<?php namespace SleepingOwl\Admin\Models;

use SleepingOwl\Admin\Admin;
use SleepingOwl\Admin\Exceptions\ModelNotFoundException;

/**
 * Class Models
 * @package SleepingOwl\Admin\Models
 */
class Models
{
	/**
	 * @var ModelItem[]
	 */
	protected $items = [];

	/**
	 * @param string $alias
	 * @throws ModelNotFoundException
	 * @return ModelItem
	 */
	public function modelWithAlias($alias)
	{
		foreach ($this->items as $item)
		{
			if ($item->getAlias() === $alias)
			{
				return $item;
			}
		}
		throw new ModelNotFoundException('Model with alias [' . $alias . '] not registered as admin module.');
	}

	/**
	 * @param string $classname
	 * @throws ModelNotFoundException
	 * @return ModelItem
	 */
	public function modelWithClassname($classname)
	{
		foreach ($this->items as $item)
		{
			if ($item->getModelClass() === $classname)
			{
				return $item;
			}
		}
		throw new ModelNotFoundException('Model with classname [' . $classname . '] not registered as admin module.');
	}

	public function getAllAliases()
	{
		return array_map(function (ModelItem $item) {
			return $item->getAlias();
		}, $this->items);
	}

	/**
	 * @param ModelItem $modelItem
	 */
	public function addItem($modelItem)
	{
		$this->items[] = $modelItem;
	}
}