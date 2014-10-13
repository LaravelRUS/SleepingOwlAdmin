<?php namespace SleepingOwl\RandomFilenamer;

use Illuminate\Support\Str;

class RandomFilenamer
{

	/**
	 * Get unique random filename with $extenstion within $path directory
	 * @param string $path
	 * @param string $extension
	 * @return string
	 */
	public static function get($path, $extension)
	{
		if ( ! Str::endsWith($path, '/'))
		{
			$path .= '/';
		}
		do
		{
			$name = Str::random(10) . '.' . $extension;
		} while (file_exists($path . $name));
		return $name;
	}

}