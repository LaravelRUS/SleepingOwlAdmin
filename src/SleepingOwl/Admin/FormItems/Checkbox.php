<?php namespace SleepingOwl\Admin\FormItems;

use Input;

class Checkbox extends NamedFormItem
{

	protected $view = 'checkbox';

	public function save()
	{
		$name = $this->name();
		if ( ! Input::has($name))
		{
			Input::merge([$name => 0]);
		}
		parent::save();
	}


}