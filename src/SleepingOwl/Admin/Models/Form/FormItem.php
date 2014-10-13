<?php namespace SleepingOwl\Admin\Models\Form;

use App;
use Closure;
use SleepingOwl\Admin\Models\Form\FormItem\Checkbox;
use SleepingOwl\Admin\Models\Form\FormItem\Ckeditor;
use SleepingOwl\Admin\Models\Form\FormItem\Date;
use SleepingOwl\Admin\Models\Form\FormItem\File;
use SleepingOwl\Admin\Models\Form\FormItem\ClosureHandler;
use SleepingOwl\Admin\Models\Form\FormItem\Hidden;
use SleepingOwl\Admin\Models\Form\FormItem\Image;
use SleepingOwl\Admin\Models\Form\FormItem\MultiSelect;
use SleepingOwl\Admin\Models\Form\FormItem\Password;
use SleepingOwl\Admin\Models\Form\FormItem\Select;
use SleepingOwl\Admin\Models\Form\FormItem\Text;
use SleepingOwl\Admin\Models\Form\FormItem\TextAddon;
use SleepingOwl\Admin\Models\Form\FormItem\Textarea;
use SleepingOwl\Admin\Models\Form\FormItem\Time;
use SleepingOwl\Admin\Models\Form\FormItem\Timestamp;
use SleepingOwl\Admin\Models\Form\FormItem\View;
use Illuminate\Support\Arr;
use SleepingOwl\Admin\Models\ModelItem;

/**
 * Class FormItem
 * @package SleepingOwl\Admin\Models\Form
 * @method static Hidden hidden($name, $label = null)
 * @method static Image image($name, $label = null)
 * @method static File file($name, $label = null)
 * @method static MultiSelect multiSelect($name, $label = null)
 * @method static Select select($name, $label = null)
 * @method static Text text($name, $label = null)
 * @method static Password password($name, $label = null)
 * @method static Checkbox checkbox($name, $label = null)
 * @method static TextAddon textAddon($name, $label = null)
 * @method static Textarea textarea($name, $label = null)
 * @method static Ckeditor ckeditor($name, $label = null)
 * @method static Date date($name, $label = null)
 * @method static Time time($name, $label = null)
 * @method static Timestamp timestamp($name, $label = null)
 * @method static View view($view)
 */
class FormItem
{
	/**
	 * @var array
	 */
	protected static $handlers = [];

	/**
	 * @param $method
	 * @param $params
	 * @return mixed
	 */
	public static function __callStatic($method, $params)
	{
		$formItem = null;
		if ($handler = static::getHandler($method))
		{
			if ($handler instanceof Closure)
			{
				$formItem = new ClosureHandler($handler);
			} else
			{
				$formItem = App::make($handler);
			}
		} else
		{
			$className = get_called_class() . '\\' . ucfirst($method);
			$formItem = new $className(Arr::get($params, 0, null), Arr::get($params, 1, ''));
		}
		ModelItem::$current->getForm()->addItem($formItem);
		return $formItem;
	}

	/**
	 * @param $name
	 * @param Closure|string $handler
	 */
	public static function register($name, $handler)
	{
		static::$handlers[$name] = $handler;
	}

	/**
	 * @param $method
	 * @return Closure|string|null
	 */
	protected static function getHandler($method)
	{
		return Arr::get(static::$handlers, $method, null);
	}

}