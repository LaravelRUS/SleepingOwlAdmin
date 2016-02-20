<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

class AdminNavigation extends Facade
{

	/**
	 * @return string
	 */
	protected static function getFacadeAccessor()
	{
		return 'sleeping_owl.navigation';
	}

} 