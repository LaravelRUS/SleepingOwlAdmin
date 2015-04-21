<?php namespace SleepingOwl\Admin\Interfaces;

interface FormInterface
{

	public function setAction($action);
	public function setId($id);
	public function validate($model);
	public function save();

}