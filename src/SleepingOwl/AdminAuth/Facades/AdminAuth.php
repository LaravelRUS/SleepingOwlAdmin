<?php namespace SleepingOwl\AdminAuth\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \Illuminate\Auth\AuthManager
 * @see \Illuminate\Auth\Guard
 */
class AdminAuth extends Facade
{

	/**
	 * Get the registered name of the component.
	 *
	 * @return string
	 */
	protected static function getFacadeAccessor()
	{
		return 'admin.auth';
	}

}
