<?php namespace SleepingOwl\Admin\Menu;

use AdminTemplate;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Admin;
use Illuminate\Support\Arr;

class MenuItem implements Renderable
{
	/**
	 * @var MenuItem
	 */
	public static $current;
	/**
	 * @var string
	 */
	protected $modelClass;
	/**
	 * @var string
	 */
	protected $label;
	/**
	 * @var string
	 */
	protected $icon;
	/**
	 * @var MenuItem[]
	 */
	protected $subItems = [];
	protected $url;
	protected $level;

	/**
	 * @param string|null $modelClass
	 */
	function __construct($modelClass = null)
	{
		$this->modelClass = $modelClass;
		if (is_null(static::$current))
		{
			static::$current = $this;
			$this->level(0);
		} else
		{
			static::$current->addItem($this);
			$this->level(static::$current->level() + 1);
		}
	}

	protected function getModelItem()
	{
		return Admin::model($this->modelClass);
	}

	public function label($label = null)
	{
		if (is_null($label))
		{
			return is_null($this->label) ? $this->getModelItem()->title() : $this->label;
		}
		$this->label = $label;
		return $this;
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

	public function items($callback = null)
	{
		if (is_null($callback))
		{
			return $this->subItems;
		}
		$old = static::$current;
		static::$current = $this;
		call_user_func($callback);
		static::$current = $old;
		return $this;
	}

	public function addItem($item)
	{
		$this->subItems[] = $item;
		return $this;
	}

	public function level($level = null)
	{
		if (is_null($level))
		{
			return $this->level;
		}
		$this->level = $level;
		return $this;
	}

	public function url($url = null)
	{
		if (is_null($url))
		{
			if ( ! is_null($this->url))
			{
				if (strpos($this->url, '://') !== false)
				{
					return $this->url;
				}
				return route('admin.wildcard', $this->url);
			}
			if ( ! is_null($this->modelClass))
			{
				return $this->getModelItem()->displayUrl();
			}
			return '#';
		}
		$this->url = $url;
		return $this;
	}

	public function render()
	{
		$params = [
			'icon'  => $this->icon(),
			'label' => $this->label(),
			'url'   => $this->url(),
			'level' => $this->level(),
			'items' => $this->items(),
		];
		return view(AdminTemplate::view('_partials.menu_item'), $params);
	}

	function __toString()
	{
		return (string)$this->render();
	}

}