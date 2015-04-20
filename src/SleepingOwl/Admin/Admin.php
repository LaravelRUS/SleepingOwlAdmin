<?php namespace SleepingOwl\Admin;

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
	protected $template;
	protected $menu;

	function __construct()
	{
		$this->menu = static::menu();
	}

	public static function instance()
	{
		if (is_null(static::$instance))
		{
			static::$instance = new static; 
		}
		return static::$instance;
	}

	public static function model($class)
	{
		return static::instance()->getModel($class);
	}

	public static function models()
	{
		return static::instance()->getModels();
	}

	public static function modelAliases()
	{
		return array_map(function ($model)
		{
			return $model->alias();
		}, static::models());
	}

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

	public function getModels()
	{
		return $this->models;
	}

	public function hasModel($class)
	{
		return array_key_exists($class, $this->models);
	}

	public function setModel($class, $model)
	{
		$this->models[$class] = $model;
	}

	public function template()
	{
		if (is_null($this->template))
		{
			$templateClass = config('admin.template');
			$this->template = app($templateClass);
		}
		return $this->template;
	}

	public static function menu($model = null)
	{
		return new MenuItem($model);
	}

	public function getMenu()
	{
		return $this->menu->items();
	}

	public static function view($content, $title = null)
	{
		$controller = app('SleepingOwl\Admin\Http\Controllers\AdminController');
		return $controller->render($title, $content);
	}

}