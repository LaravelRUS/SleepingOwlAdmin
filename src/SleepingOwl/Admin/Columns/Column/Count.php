<?php namespace SleepingOwl\Admin\Columns\Column;

use AdminTemplate;

class Count extends NamedColumn
{

	public function render()
	{
		$params = [
			'value'  => count($this->getValue($this->instance, $this->name())),
			'append' => $this->append(),
		];
		return view(AdminTemplate::view('column.count'), $params);
	}

}