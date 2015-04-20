<?php namespace SleepingOwl\Admin\Filter;

class FilterScope extends FilterField
{

	public function apply($query)
	{
		call_user_func([$query, $this->name()], $this->value());
	}

}