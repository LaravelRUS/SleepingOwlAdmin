<?php namespace SleepingOwl\Admin\AssetManager;

use AdminAuth;
use App;
use SleepingOwl\Admin\Admin;
use SleepingOwl\Admin\Router;

class AssetManager
{
	protected static $styles = [];

	protected static $scripts = [];

	public static function styles()
	{
		return static::assets(static::$styles);
	}

	public static function addStyle($style)
	{
		static::$styles[] = $style;
	}

	public static function scripts()
	{
		return static::assets(static::$scripts);
	}

	public static function addScript($script)
	{
		static::$scripts[] = $script;
	}

	protected static function assets($assets)
	{
		return array_map(function ($asset)
		{
			if (strpos($asset, 'admin::') !== false)
			{
				$asset = str_replace('admin::', '', $asset);
				return asset('packages/sleeping-owl/admin/' . $asset);
			}
			return $asset;
		}, array_unique($assets));
	}
} 