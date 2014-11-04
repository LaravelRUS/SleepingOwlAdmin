<?php namespace SleepingOwl\Admin\Columns\Interfaces;

interface ColumnInterface
{

	/**
	 * @return string
	 */
	public function renderHeader();

	/**
	 * @param $instance
	 * @param int $totalCount
	 * @return string
	 */
	public function render($instance, $totalCount);

	/**
	 * @return bool
	 */
	public function isHidden();

	/**
	 * @return string
	 */
	public function getName();

} 