<?php namespace SleepingOwl\Models\Traits;

trait DeleteAllModelTrait
{
	/**
	 * Delete all items one by one with business logic
	 */
	public static function deleteAll()
	{
		static::all()->each(function ($row)
		{
			$row->delete();
		});
	}
}