<?php namespace SleepingOwl\Admin\Filter;

use Input;
use SleepingOwl\Admin\Interfaces\FilterInterface;

abstract class FilterBase implements FilterInterface
{

	protected $name;
	protected $alias;
	protected $title;
	protected $value;

	function __construct($name)
	{
		$this->name($name);
		$this->alias($name);
	}

	public function name($name = null)
	{
		if (is_null($name))
		{
			return $this->name;
		}
		$this->name = $name;
		return $this;
	}

	public function alias($alias = null)
	{
		if (is_null($alias))
		{
			return $this->alias;
		}
		$this->alias = $alias;
		return $this;
	}

	public function title($title = null)
	{
		if (is_null($title))
		{
			if (is_callable($this->title))
			{
				return call_user_func($this->title, $this->value());
			}
			return $this->title;
		}
		$this->title = $title;
		return $this;
	}

	public function value($value = null)
	{
		if (is_null($value))
		{
			return $this->value;
		}
		$this->value = $value;
		return $this;
	}

	public function initialize()
	{
		$parameters = Input::all();
		$value = $this->value();
		if (is_null($value))
		{
			$value = array_get($parameters, $this->alias());
		}
		$this->value($value);
	}

	public function isActive()
	{
		return ! is_null($this->value());
	}

	public function apply($query)
	{
		$query->where($this->name(), $this->value());
	}

}