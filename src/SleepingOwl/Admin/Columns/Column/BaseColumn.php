<?php namespace SleepingOwl\Admin\Columns\Column;

use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Admin;
use SleepingOwl\Admin\Interfaces\ColumnInterface;

abstract class BaseColumn implements Renderable, ColumnInterface
{

	protected $header;
	protected $instance;
	protected $append;

	function __construct()
	{
		$this->header = new ColumnHeader;
	}

	public function initialize()
	{
	}

	protected function model()
	{
		return Admin::model(get_class($this->instance));
	}

	public function label($title)
	{
		$this->header->title($title);
		return $this;
	}

	public function orderable($orderable)
	{
		$this->header->orderable($orderable);
		return $this;
	}

	public function header()
	{
		return $this->header;
	}

	public function append($append = null)
	{
		if (is_null($append))
		{
			return $this->append;
		}
		$this->append = $append;
		return $this;
	}

	public function setInstance($instance)
	{
		$this->instance = $instance;
		if ( ! is_null($this->append()) && ($this->append() instanceof ColumnInterface))
		{
			$this->append()->setInstance($instance);
		}
		return $this;
	}

	function __toString()
	{
		return (string)$this->render();
	}


}