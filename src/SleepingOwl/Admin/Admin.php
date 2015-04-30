<?php namespace SleepingOwl\Admin;

use Illuminate\View\View;
use SleepingOwl\Admin\Interfaces\TemplateInterface;
use SleepingOwl\Admin\Menu\MenuItem;
use SleepingOwl\Admin\Model\ModelConfiguration;

class Admin
{
	/**
	 * @var Admin
	 */
	protected static $instance;
	/**
	 * @var ModelConfiguration[]
	 */
	protected $models = [];
	/**
	 * @var TemplateInterface
	 */
	protected $template;
	/**
	 * @var MenuItem
	 */
	protected $menu;

	function __construct()
	{
		$this->menu = static::menu();
	}

	/**
	 * @return Admin
	 */
	public static function instance()
	{
		if (is_null(static::$instance))
		{
			static::$instance = new static; 
		}
		return static::$instance;
	}

	/**
	 * @param $class
	 * @return ModelConfiguration
	 */
	public static function model($class)
	{
		return static::instance()->getModel($class);
	}

	/**
	 * @return Model\ModelConfiguration[]
	 */
	public static function models()
	{
		return static::instance()->getModels();
	}

	/**
	 * @return string[]
	 */
	public static function modelAliases()
	{
		return array_map(function ($model)
		{
			return $model->alias();
		}, static::models());
	}

	/**
	 * @param $class
	 * @return ModelConfiguration
	 */
	public function getModel($class)
	{
		if ($this->hasModel($class))
		{
			return $this->models[$class];
		}
		$model = new ModelConfiguration($class);
		$this->setModel($class, $model);
		return $model;
	}

	/**
	 * @return Model\ModelConfiguration[]
	 */
	public function getModels()
	{
		return $this->models;
	}

	/**
	 * @param $class
	 * @return bool
	 */
	public function hasModel($class)
	{
		return array_key_exists($class, $this->models);
	}

	/**
	 * @param $class
	 * @param ModelConfiguration $model
	 */
	public function setModel($class, $model)
	{
		$this->models[$class] = $model;
	}

	/**
	 * @return TemplateInterface
	 */
	public function template()
	{
		if (is_null($this->template))
		{
			$templateClass = config('admin.template');
			$this->template = app($templateClass);
		}
		return $this->template;
	}

	/**
	 * @param string|null $model
	 * @return MenuItem
	 */
	public static function menu($model = null)
	{
		return new MenuItem($model);
	}

	/**
	 * @return MenuItem[]
	 */
	public function getMenu()
	{
		return $this->menu->items();
	}

	/**
	 * @param $content
	 * @param string|null $title
	 * @return View
	 */
	public static function view($content, $title = null)
	{
		$controller = app('SleepingOwl\Admin\Http\Controllers\AdminController');
		return $controller->render($title, $content);
	}

}