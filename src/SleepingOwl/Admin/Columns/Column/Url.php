<?php namespace SleepingOwl\Admin\Columns\Column;

use AdminTemplate;
use Illuminate\View\View;

class Url extends NamedColumn
{

	/**
	 * @return View
	 */
	public function render()
	{
		$params = [
			'url'    => $this->getValue($this->instance, $this->name()),
		];
		return view(AdminTemplate::view('column.url'), $params);
	}

}