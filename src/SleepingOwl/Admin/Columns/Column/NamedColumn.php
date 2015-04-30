<?php namespace SleepingOwl\Admin\Columns\Column;

use Illuminate\Database\Eloquent\Collection;

abstract class NamedColumn extends BaseColumn
{

	/**
	 * Column field name
	 * @var string
	 */
	protected $name;

	/**
	 * @param $name
	 */
	function __construct($name)
	{
		parent::__construct();

		$this->name($name);
	}

	/**
	 * Get or set column field name
	 * @param string|null $name
	 * @return $this|string
	 */
	public function name($name = null)
	{
		if (is_null($name))
		{
			return $this->name;
		}
		$this->name = $name;
		return $this;
	}

	/**
	 * Get column value from instance
	 * @param mixed $instance
	 * @param string $name
	 * @return mixed
	 */
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