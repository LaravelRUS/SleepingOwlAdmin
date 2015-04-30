<?php namespace SleepingOwl\Admin\Columns\Column;

use AdminTemplate;
use Closure;

class Action extends NamedColumn
{

	/**
	 * Action icon class
	 * @var string
	 */
	protected $icon;
	/**
	 * Action button style ('long' or 'short')
	 * @var string
	 */
	protected $style = 'long';
	/**
	 * Button submit action
	 * @var Closure
	 */
	protected $callback;
	/**
	 * Action button target ('_self', '_blank' or any else)
	 * @var string
	 */
	protected $target = '_self';
	/**
	 * Action button value (button label)
	 * @var string
	 */
	protected $value;
	/**
	 * Action button url
	 * @var string
	 */
	protected $url;

	/**
	 * @param string $name
	 */
	function __construct($name)
	{
		parent::__construct($name);
		$this->orderable(false);
	}

	/**
	 * Get or set icon class
	 * @param string|null $icon
	 * @return $this|string
	 */
	public function icon($icon = null)
	{
		if (is_null($icon))
		{
			return $this->icon;
		}
		$this->icon = $icon;
		return $this;
	}

	/**
	 * Get or set action button style
	 * @param string|null $style
	 * @return $this|string
	 */
	public function style($style = null)
	{
		if (is_null($style))
		{
			return $this->style;
		}
		$this->style = $style;
		return $this;
	}

	/**
	 * Get or set action callback
	 * @param Closure|null $callback
	 * @return $this|Closure
	 */
	public function callback($callback = null)
	{
		if (is_null($callback))
		{
			return $this->callback;
		}
		$this->callback = $callback;
		return $this;
	}

	/**
	 * Get or set action button target
	 * @param string|null $target
	 * @return $this|string
	 */
	public function target($target = null)
	{
		if (is_null($target))
		{
			return $this->target;
		}
		$this->target = $target;
		return $this;
	}

	/**
	 * Get or set action buttom value (buttom label)
	 * @param string|null $value
	 * @return $this|string
	 */
	public function value($value = null)
	{
		if (is_null($value))
		{
			return $this->value;
		}
		$this->value = $value;
		return $this;
	}

	/**
	 * Render action button
	 * @return \Illuminate\View\View
	 */
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

	/**
	 * Get or set action button url
	 * @param string|null $url
	 * @return $this|string
	 */
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

	/**
	 * Call action button callback
	 * @param $instance
	 */
	public function call($instance)
	{
		$callback = $this->callback();
		call_user_func($callback, $instance);
	}

}