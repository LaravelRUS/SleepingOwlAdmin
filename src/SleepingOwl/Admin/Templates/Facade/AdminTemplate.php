<?php namespace SleepingOwl\Admin\Templates\Facade;

use Illuminate\Support\Facades\Facade;

class AdminTemplate extends Facade
{

	/**
	 * @return string
	 */
	protected static function getFacadeAccessor()
	{
		return 'adminTemplate';
	}

} 