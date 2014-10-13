<?php namespace SleepingOwl\Admin\Exceptions;

use Illuminate\Support\MessageBag;

/**
 * Class ValidationException
 * @package SleepingOwl\Admin\Exceptions
 */
class ValidationException extends \Exception
{
	/**
	 * @var MessageBag
	 */
	protected $errors;

	/**
	 * @param MessageBag $errors
	 */
	function __construct(MessageBag $errors)
	{
		$this->errors = $errors;
	}

	/**
	 * @return MessageBag
	 */
	public function getErrors()
	{
		return $this->errors;
	}

}