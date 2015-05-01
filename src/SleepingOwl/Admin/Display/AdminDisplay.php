<?php namespace SleepingOwl\Admin\Display;

use SleepingOwl\Admin\Base\AliasBinder;

/**
 * @method static \SleepingOwl\Admin\Display\DisplayDatatables datatables()
 * @method static \SleepingOwl\Admin\Display\DisplayDatatablesAsync datatablesAsync()
 * @method static \SleepingOwl\Admin\Display\DisplayTab tab($display)
 * @method static \SleepingOwl\Admin\Display\DisplayTabbed tabbed()
 * @method static \SleepingOwl\Admin\Display\DisplayTable table()
 * @method static \SleepingOwl\Admin\Display\DisplayTree tree()
 */
class AdminDisplay extends AliasBinder
{

	/**
	 * Display class aliases
	 * @var string[]
	 */
	protected static $aliases = [];

}