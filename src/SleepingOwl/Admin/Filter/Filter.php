<?php namespace SleepingOwl\Admin\Filter;

use SleepingOwl\Admin\Base\AliasBinder;

/**
 * Class Filter
 * @package SleepingOwl\Admin\Filter
 * @method static \SleepingOwl\Admin\Filter\FilterCustom custom($name)
 * @method static \SleepingOwl\Admin\Filter\FilterField field($name)
 * @method static \SleepingOwl\Admin\Filter\FilterRelated related($name)
 * @method static \SleepingOwl\Admin\Filter\FilterScope scope($name)
 */
class Filter extends AliasBinder
{
	protected static $aliases = [];
}