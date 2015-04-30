<?php namespace SleepingOwl\Admin\Interfaces;

interface FormInterface
{

	/**
	 * Set form action url
	 * @param string $action
	 */
	public function setAction($action);

	/**
	 * Set form model instance id
	 * @param int $id
	 */
	public function setId($id);

	/**
	 * Validate model
	 * @param mixed $model
	 */
	public function validate($model);

	/**
	 * Save model
	 * @param mixed $model
	 */
	public function save($model);

}