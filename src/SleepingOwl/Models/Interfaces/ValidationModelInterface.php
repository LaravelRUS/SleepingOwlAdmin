<?php namespace SleepingOwl\Models\Interfaces;

interface ValidationModelInterface
{
	/**
	 * @param $data
	 * @param array $rules
	 * @throws \SleepingOwl\Admin\Exceptions\ValidationException
	 * @return void
	 */
	public function validate($data, $rules = []);

	/**
	 * @return array
	 */
	public function getValidationRules();

} 