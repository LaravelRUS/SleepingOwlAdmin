<?php namespace SleepingOwl\Admin\Columns\Column;

use AdminTemplate;
use Route;
use SleepingOwl\Admin\Interfaces\WithRoutesInterface;

class Action extends NamedColumn
{

	protected $icon;
	protected $style = 'long';
	protected $callback;
	protected $target = '_self';
	protected $value;
	protected $url;

	function __construct($name)
	{
		parent::__construct($name);
		$this->orderable(false);
	}

	public function icon($icon = null)
	{
		if (is_null($icon))
		{
			return $this->icon;
		}
		$this->icon = $icon;
		return $this;
	}

	public function style($style = null)
	{
		if (is_null($style))
		{
			return $this->style;
		}
		$this->style = $style;
		return $this;
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

	public function target($target = null)
	{
		if (is_null($target))
		{
			return $this->target;
		}
		$this->target = $target;
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

	public function render()
	{
		$params = [
			'icon'   => $this->icon(),
			'style'  => $this->style(),
			'value'  => $this->value(),
			'target' => $this->target(),
			'url'    => $this->url(),
		];
		return view(AdminTemplate::view('column.action'), $params);
	}

	public function url($url = null)
	{
		if (is_null($url))
		{
			if ( ! is_null($this->url))
			{
				if (is_callable($this->url))
				{
					return call_user_func($this->url, $this->instance);
				}
				if ( ! is_null($this->instance))
				{
					return strtr($this->url, [':id' => $this->instance->getKey()]);
				}
				return $this->url;
			}
			return $this->model()->displayUrl([
				'_action' => $this->name(),
				'_id'     => $this->instance->getKey(),
			]);
		}
		$this->url = $url;
		return $this;
	}

	public function call($instance)
	{
		$callback = $this->callback();
		call_user_func($callback, $instance);
	}

}