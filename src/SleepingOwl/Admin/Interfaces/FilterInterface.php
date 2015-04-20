<?php namespace SleepingOwl\Admin\Interfaces;

interface FilterInterface
{

	public function initialize();
	public function isActive();
	public function apply($query);

} 