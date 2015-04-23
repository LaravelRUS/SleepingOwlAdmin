<?php namespace SleepingOwl\Admin\FormItems;

class File extends Image
{

	protected $view = 'file';

	protected static function uploadValidationRules()
	{
		return [
			'file' => 'required',
		];
	}

} 