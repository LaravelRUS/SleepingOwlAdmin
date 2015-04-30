<?php namespace SleepingOwl\Admin\Interfaces;

interface FilterInterface
{

	/**
	 * Initialize filter
	 */
	public function initialize();

	/**
	 * Is filter active?
	 */
	public function isActive();

	/**
	 * Apply filter to the query
	 * @param $query
	 */
	public function apply($query);

} 