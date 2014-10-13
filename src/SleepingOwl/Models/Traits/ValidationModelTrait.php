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
	 * @return bool
	 * @throws ValidationException
	 */
	public function validate($data)
	{
		$validator = Validator::make($data, $this->getValidationRules(), Lang::get('admin::validation'), ['id' => $this->id]);

		if ($validator->fails())
		{
			throw new ValidationException($validator->errors());
		}
		return true;
	}
} 