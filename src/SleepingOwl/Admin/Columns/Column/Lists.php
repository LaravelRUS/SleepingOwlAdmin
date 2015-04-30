<?php namespace SleepingOwl\Admin\Columns\Column;

use AdminTemplate;
use Illuminate\View\View;

class Lists extends NamedColumn
{

	/**
	 * @return View
	 */
	public function render()
	{
		$params = [
			'values'  => $this->getValue($this->instance, $this->name()),
			'append' => $this->append(),
		];
		return view(AdminTemplate::view('column.lists'), $params);
	}

}