<?php namespace SleepingOwl\Models\Interfaces;

interface ModelWithOrderFieldInterface
{
	/**
	 * @return int
	 */
	public function getOrderValue();

	/**
	 * @return void
	 */
	public function moveUp();

	/**
	 * @return void
	 */
	public function moveDown();

	/**
	 * @return string
	 */
	public function getSortField();
}