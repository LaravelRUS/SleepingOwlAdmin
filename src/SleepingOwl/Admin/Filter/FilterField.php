<?php namespace SleepingOwl\Admin\Filter;

class FilterField extends FilterBase
{

	public function title($title = null)
	{
		$parent = parent::title($title);
		if (is_null($parent))
		{
			return $this->value();
		}
		return $parent;
	}

}