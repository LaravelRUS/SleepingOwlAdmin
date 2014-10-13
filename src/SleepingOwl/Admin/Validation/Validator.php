<?php namespace SleepingOwl\Admin\Validation;

use Illuminate\Validation\Validator as IlluminateValidator;

/**
 * Class Validator
 *
 * @package SleepingOwl\Admin\Validation
 */
class Validator extends IlluminateValidator
{
	/**
	 * @var array
	 */
	protected $implicitRules = [
		'Required',
		'RequiredWith',
		'RequiredWithAll',
		'RequiredWithout',
		'RequiredWithoutAll',
		'RequiredIf',
		'Accepted',
		'RequiredOnlyOnCreate'
	];

	/**
	 * @param $attribute
	 * @param $value
	 * @param $parameters
	 * @return bool
	 */
	protected function validateUrlStub($attribute, $value, $parameters)
	{
		return $this->validateRegex($attribute, $value, ['/^[a-zA-Z0-9-_]+$/']);
	}

	/**
	 * @param $attribute
	 * @param $value
	 * @param $parameters
	 * @return bool
	 */
	protected function validateUrlStubFull($attribute, $value, $parameters)
	{
		return $this->validateRegex($attribute, $value, ['/^[a-zA-Z0-9-_\/]+$/']);
	}

	/**
	 * @param string $attribute
	 * @param mixed $value
	 * @param array $parameters
	 * @return bool
	 */
	protected function validateUnique($attribute, $value, $parameters)
	{
		$id = $this->customAttributes['id'];
		if ($id !== null)
		{
			$parameters[] = $id;
		}
		return parent::validateUnique($attribute, $value, $parameters);
	}

	/**
	 * @param $attribute
	 * @param $value
	 * @param $parameters
	 * @return bool
	 */
	protected function validateRequiredOnlyOnCreate($attribute, $value, $parameters)
	{
		$id = $this->customAttributes['id'];
		if ($id !== null) return true;

		return parent::validateRequired($attribute, $value);
	}

	/**
	 * @param $attribute
	 * @param $value
	 * @return bool
	 */
	protected function validateNotPhp($attribute, $value)
	{
		if ($value->getClientMimeType() === 'text/php') return false;
		return true;
	}

}