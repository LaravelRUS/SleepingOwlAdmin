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

} 