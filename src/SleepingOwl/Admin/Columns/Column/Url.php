<?php namespace SleepingOwl\Admin\Columns\Column;

use AdminTemplate;
use SleepingOwl\Admin\Admin;

class Url extends NamedColumn
{

	function __construct($name)
	{
		parent::__construct($name);
	}

	public function render()
	{
		$params = [
			'url'    => $this->getValue($this->instance, $this->name()),
		];
		return view(AdminTemplate::view('column.url'), $params);
	}

}