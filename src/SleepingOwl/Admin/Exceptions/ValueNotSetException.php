<?php namespace SleepingOwl\Admin\Exceptions;

class ValueNotSetException extends \Exception
{
	public function __construct()
	{
		$message = 'You must set field to load selected items from in multiselect. Use [value($field)] method.';
		parent::__construct($message, 0, null);
	}
}