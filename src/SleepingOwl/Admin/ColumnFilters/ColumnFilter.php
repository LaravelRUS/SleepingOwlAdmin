<?php namespace SleepingOwl\Admin\ColumnFilters;

use SleepingOwl\Admin\Base\AliasBinder;

/**
 * @method static \SleepingOwl\Admin\ColumnFilters\Text text()
 * @method static \SleepingOwl\Admin\ColumnFilters\Date date()
 * @method static \SleepingOwl\Admin\ColumnFilters\Select select()
 * @method static \SleepingOwl\Admin\ColumnFilters\Range range()
 */
class ColumnFilter extends AliasBinder
{

	/**
	 * Column filter class aliases
	 * @var string[]
	 */
	protected static $aliases = [];

}