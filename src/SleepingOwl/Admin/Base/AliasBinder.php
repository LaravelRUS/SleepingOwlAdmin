<?php namespace SleepingOwl\Admin\Base;

use SleepingOwl\Admin\Interfaces\WithRoutesInterface;
use SleepingOwl\Admin\Providers\RouteServiceProvider;

abstract class AliasBinder
{

	public static function register($alias, $class)
	{
		static::$aliases[$alias] = $class;
		if (method_exists($class, 'registerRoutes'))
		{
			RouteServiceProvider::registerRoutes(function () use ($class)
			{
				call_user_func([
					$class,
					'registerRoutes'
				]);
			});
		}
	}

	public static function getAlias($alias)
	{
		return static::$aliases[$alias];
	}

	public static function hasAlias($alias)
	{
		return array_key_exists($alias, static::$aliases);
	}

	public static function __callStatic($name, $arguments)
	{
		if ( ! static::hasAlias($name))
		{
			throw new \BadMethodCallException($name);
		}
		return app(static::getAlias($name), $arguments);
	}

} 