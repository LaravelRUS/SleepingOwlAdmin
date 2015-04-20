<?php namespace SleepingOwl\Admin\Columns\Column;

use AdminTemplate;

class Lists extends NamedColumn
{

	public function render()
	{
		$params = [
			'values'  => $this->getValue($this->instance, $this->name()),
			'append' => $this->append(),
		];
		return view(AdminTemplate::view('column.lists'), $params);
	}

}