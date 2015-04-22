<?php namespace SleepingOwl\Admin\FormItems;

use SleepingOwl\Admin\Base\AliasBinder;

/**
 * Class AdminForm
 * @package SleepingOwl\Admin\Form
 * @method static \SleepingOwl\Admin\FormItems\Text text($name, $label = null)
 * @method static \SleepingOwl\Admin\FormItems\Select select($name, $label = null)
 * @method static \SleepingOwl\Admin\FormItems\MultiSelect multiselect($name, $label = null)
 * @method static \SleepingOwl\Admin\FormItems\Columns columns()
 * @method static \SleepingOwl\Admin\FormItems\Hidden hidden($name)
 * @method static \SleepingOwl\Admin\FormItems\Custom custom()
 * @method static \SleepingOwl\Admin\FormItems\Checkbox checkbox($name, $label = null)
 * @method static \SleepingOwl\Admin\FormItems\CKEditor ckeditor($name, $label = null)
 */
class FormItem extends AliasBinder
{
	protected static $aliases = [];
}