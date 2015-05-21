<?php namespace SleepingOwl\Admin\Helpers;

class ExceptionHandler
{

	public static function handle($exception)
	{
		$previousHandler = set_exception_handler(function ()
		{
		});
		restore_error_handler();
		call_user_func($previousHandler, $exception);
		die;
	}

} 