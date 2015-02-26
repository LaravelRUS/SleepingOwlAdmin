<?php namespace SleepingOwl\Admin\Models\Form\Interfaces;

interface FormItemInterface
{

	/**
	 * @return string
	 */
	public function render();

	/**
	 * @return string
	 */
	public function getName();

	/**
	 * @return array|null
	 */
	public function getValidationRules();

	/**
	 * @return mixed
	 */
	public function getDefault();

	/**
	 * @param array $data
	 */
	public function updateRequestData(&$data);

}