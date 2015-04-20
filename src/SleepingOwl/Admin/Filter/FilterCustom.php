<?php namespace SleepingOwl\Admin\Filter;

class FilterCustom extends FilterField
{

	protected $callback;

	public function apply($query)
	{
		call_user_func($this->callback(), $query, $this->value());
	}

	public function callback($callback = null)
	{
		if (is_null($callback))
		{
			return $this->callback;
		}
		$this->callback = $callback;
		return $this;
	}

}