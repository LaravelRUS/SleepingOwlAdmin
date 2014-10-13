<?php namespace SleepingOwl\Admin\Exceptions;

class ModelAttributeNotFoundException extends \Exception
{
	public function __construct($model, $property)
	{
		$message = "Attribute [{$model}.{$property}] doest exist";
		parent::__construct($message, 0, null);
	}

}