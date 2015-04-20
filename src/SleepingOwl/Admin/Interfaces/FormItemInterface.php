<?php namespace SleepingOwl\Admin\Interfaces;

interface FormItemInterface
{

	public function initialize();
	public function setInstance($instance);
	public function getValidationRules();
	public function save();

} 