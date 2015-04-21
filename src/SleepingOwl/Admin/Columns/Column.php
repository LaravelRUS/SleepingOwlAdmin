<?php namespace SleepingOwl\Admin\Columns;

use SleepingOwl\Admin\Base\AliasBinder;

/**
 * Class Column
 * @package SleepingOwl\Admin\Columns
 * @method static \SleepingOwl\Admin\Columns\Column\Count count($name)
 * @method static \SleepingOwl\Admin\Columns\Column\String string($name)
 * @method static \SleepingOwl\Admin\Columns\Column\Filter filter($name)
 * @method static \SleepingOwl\Admin\Columns\Column\Url url($name)
 * @method static \SleepingOwl\Admin\Columns\Column\Lists lists($name)
 * @method static \SleepingOwl\Admin\Columns\Column\DateTime datetime($name)
 * @method static \SleepingOwl\Admin\Columns\Column\Custom custom()
 * @method static \SleepingOwl\Admin\Columns\Column\Control control()
 * @method static \SleepingOwl\Admin\Columns\Column\TreeControl treeControl()
 * @method static \SleepingOwl\Admin\Columns\Column\Order order()
 */
class Column extends AliasBinder
{
	protected static $aliases = [];
}