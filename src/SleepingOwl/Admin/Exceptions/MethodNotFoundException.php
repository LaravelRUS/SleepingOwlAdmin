<?php namespace SleepingOwl\Admin\Exceptions;

class MethodNotFoundException extends \Exception
{
	public function __construct($class, $method)
	{
		$message = "Method {$class}::{$method} not exist";
		parent::__construct($message, 0, null);
	}
}