<?php namespace SleepingOwl\Models\Interfaces;

interface ValidationModelInterface
{
	/**
	 * @param $data
	 * @throws \SleepingOwl\Admin\Exceptions\ValidationException
	 * @return void
	 */
	public function validate($data);

	/**
	 * @return array
	 */
	public function getValidationRules();

} 