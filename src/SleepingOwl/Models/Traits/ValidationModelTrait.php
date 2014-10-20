<?php namespace SleepingOwl\Models\Traits;

use SleepingOwl\Admin\Exceptions\ValidationException;
use Lang;
use Validator;

/**
 * Class ValidationModelTrait
 *
 * @package SleepingOwl\Admin\Models\Traits
 */
trait ValidationModelTrait
{
	/**
	 * @param $data
	 * @param array $rules
	 * @throws ValidationException
	 * @return bool
	 */
	public function validate($data, $rules = [])
	{
		$rules = $this->mergeValidationRules($rules);
		$validator = Validator::make($data, $rules, Lang::get('admin::validation'), ['id' => $this->id]);

		if ($validator->fails())
		{
			throw new ValidationException($validator->errors());
		}
		return true;
	}

	/**
	 * @param $rules
	 * @return array
	 */
	protected function mergeValidationRules($rules)
	{
		foreach ($this->getValidationRules() as $field => $rule)
		{
			if (!is_array($rule))
			{
				$rule = explode('|', $rule);
			}
			$rules[$field] = array_merge($rules[$field], $rule);
		}
		return $rules;
	}

	public function getValidationRules()
	{
		return [];
	}
} 