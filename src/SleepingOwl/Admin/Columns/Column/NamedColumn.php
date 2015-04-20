<?php namespace SleepingOwl\Admin\Columns\Column;

use Illuminate\Database\Eloquent\Collection;

abstract class NamedColumn extends BaseColumn
{

	protected $name;

	function __construct($name)
	{
		parent::__construct();
		$this->name = $name;
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

	protected function getValue($instance, $name)
	{
		$parts = explode('.', $name);
		$part = array_shift($parts);
		if ($instance instanceof Collection)
		{
			$instance = $instance->lists($part);
		} else
		{
			$instance = $instance->{$part};
		}
		if ( ! empty($parts) && ! is_null($instance))
		{
			return $this->getValue($instance, implode('.', $parts));
		}
		return $instance;
	}

}