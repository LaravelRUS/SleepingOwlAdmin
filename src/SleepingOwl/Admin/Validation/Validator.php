<?php namespace SleepingOwl\Admin\Validation;

use Illuminate\Support\Arr;
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
		if (isset($this->customAttributes['id']))
		{
			$id = $this->customAttributes['id'];
			if ($id !== null)
			{
				$parameters[] = $id;
			}
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

	protected function validateDate($attribute, $value)
	{
		$parameters = func_get_args()[2];
		if (Arr::get($parameters, 0) == 'locale')
		{
			return $this->validateDateWithLocale($attribute, $value);
		}
		return parent::validateDate($attribute, $value);
	}


	protected function validateDateWithLocale($attribute, $value)
	{
		if ($this->validateDate($attribute, $value, []))
		{
			return true;
		}
		$containsTime = (strpos($value, ':') !== false) ? 3 : -1;
		$formatter = datefmt_create(\App::getLocale(), 3, $containsTime);
		$value = $formatter->parse($value);
		return $value !== false;
	}

}