<?php namespace SleepingOwl\Models\Interfaces;

interface ModelWithImageFieldsInterface
{

	/**
	 * Get array of image field names and its directories within images folder
	 *
	 * Keys of array is image field names
	 * Values is their directories
	 *
	 * @return string[]
	 */
	public function getImageFields();

	/**
	 * @param $field
	 * @return bool
	 */
	public function hasImageField($field);

}