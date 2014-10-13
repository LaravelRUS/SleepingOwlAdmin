<?php namespace SleepingOwl\Models\Interfaces;

interface ModelWithFileFieldsInterface
{

	/**
	 * Get array of file field names and its directories within files folder
	 *
	 * Keys of array is file field names
	 * Values is their directories
	 *
	 * @return string[]
	 */
	public function getFileFields();

	/**
	 * @param $field
	 * @return bool
	 */
	public function hasFileField($field);

}