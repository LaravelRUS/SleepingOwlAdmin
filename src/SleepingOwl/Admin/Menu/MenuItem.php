<?php namespace SleepingOwl\Admin\Menu;

use AdminTemplate;
use Closure;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\View\View;
use SleepingOwl\Admin\Admin;
use Illuminate\Support\Arr;
use SleepingOwl\Admin\Model\ModelConfiguration;

class MenuItem implements Renderable
{

	/**
	 * Current menu item
	 * @var MenuItem
	 */
	public static $current;
	/**
	 * Menu item related model class
	 * @var string
	 */
	protected $modelClass;
	/**
	 * Menu item label
	 * @var string
	 */
	protected $label;
	/**
	 * Menu item icon
	 * @var string
	 */
	protected $icon;
	/**
	 * Menu item subitems
	 * @var MenuItem[]
	 */
	protected $subItems = [];
	/**
	 * Menu item url
	 * @var string
	 */
	protected $url;
	/**
	 * Menu item depth level
	 * @var int
	 */
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

	/**
	 * Get related model configuration
	 * @return ModelConfiguration
	 */
	protected function getModelItem()
	{
		return Admin::model($this->modelClass);
	}

	/**
	 * Get or set menu item label
	 * @param string|null $label
	 * @return $this|string
	 */
	public function label($label = null)
	{
		if (is_null($label))
		{
			return is_null($this->label) ? $this->getModelItem()->title() : $this->label;
		}
		$this->label = $label;
		return $this;
	}

	/**
	 * Get or set menu item icon
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
	 * Get or set menu item subitems
	 * @param Closure|null $callback
	 * @return $this|MenuItem[]
	 */
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

	/**
	 * Add subitem
	 * @param MenuItem $item
	 * @return $this
	 */
	public function addItem($item)
	{
		$this->subItems[] = $item;
		return $this;
	}

	/**
	 * Get or set menu item depth level
	 * @param int|null $level
	 * @return $this|int
	 */
	public function level($level = null)
	{
		if (is_null($level))
		{
			return $this->level;
		}
		$this->level = $level;
		return $this;
	}

	/**
	 * Get or set menu item url
	 * @param string|null $url
	 * @return $this|string
	 */
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

	/**
	 * @return View
	 */
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

	/**
	 * @return string
	 */
	function __toString()
	{
		return (string)$this->render();
	}

}