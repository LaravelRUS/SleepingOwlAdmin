<?php namespace SleepingOwl\Admin\AssetManager;

class AssetManager
{

	/**
	 * Registered styles
	 * @var string[]
	 */
	protected static $styles = [];
	/**
	 * Registered scripts
	 * @var string[]
	 */
	protected static $scripts = [];

	/**
	 * Return all registered styles
	 * @return string[]
	 */
	public static function styles()
	{
		return static::assets(static::$styles);
	}

	/**
	 * Register style
	 * @param $style
	 */
	public static function addStyle($style)
	{
		static::$styles[] = $style;
	}

	/**
	 * Get all registered scripts
	 * @return string[]
	 */
	public static function scripts()
	{
		return static::assets(static::$scripts);
	}

	/**
	 * Register script
	 * @param $script
	 */
	public static function addScript($script)
	{
		static::$scripts[] = $script;
	}

	/**
	 * Get only unique values from $assets and generate admin package asset urls
	 * @param string[] $assets
	 * @return string[]
	 */
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