<?php namespace SleepingOwl\Admin\FormItems;

use SleepingOwl\Admin\Base\AliasBinder;

/**
 * Class AdminForm
 * @package SleepingOwl\Admin\Form
 * @method static \SleepingOwl\Admin\FormItems\Text text($name, $label = null)
 * @method static \SleepingOwl\Admin\FormItems\Image image($name, $label = null)
 * @method static \SleepingOwl\Admin\FormItems\Images images($name, $label = null)
 * @method static \SleepingOwl\Admin\FormItems\File file($name, $label = null)
 * @method static \SleepingOwl\Admin\FormItems\Time time($name, $label = null)
 * @method static \SleepingOwl\Admin\FormItems\Date date($name, $label = null)
 * @method static \SleepingOwl\Admin\FormItems\Timestamp timestamp($name, $label = null)
 * @method static \SleepingOwl\Admin\FormItems\TextAddon textaddon($name, $label = null)
 * @method static \SleepingOwl\Admin\FormItems\Password password($name, $label = null)
 * @method static \SleepingOwl\Admin\FormItems\Select select($name, $label = null)
 * @method static \SleepingOwl\Admin\FormItems\MultiSelect multiselect($name, $label = null)
 * @method static \SleepingOwl\Admin\FormItems\Columns columns()
 * @method static \SleepingOwl\Admin\FormItems\Hidden hidden($name)
 * @method static \SleepingOwl\Admin\FormItems\Custom custom()
 * @method static \SleepingOwl\Admin\FormItems\View view($view)
 * @method static \SleepingOwl\Admin\FormItems\Checkbox checkbox($name, $label = null)
 * @method static \SleepingOwl\Admin\FormItems\CKEditor ckeditor($name, $label = null)
 * @method static \SleepingOwl\Admin\FormItems\Textarea textarea($name, $label = null)
 * @method static \SleepingOwl\Admin\FormItems\Radio radio($name, $label = null)
 */
class FormItem extends AliasBinder
{
	protected static $aliases = [];
}