<?php namespace SleepingOwl\Admin\Columns\Column;

use AdminTemplate;

class String extends NamedColumn
{

	public function render()
	{
		$params = [
			'value'  => $this->getValue($this->instance, $this->name()),
			'append' => $this->append(),
		];
		return view(AdminTemplate::view('column.string'), $params);
	}

}