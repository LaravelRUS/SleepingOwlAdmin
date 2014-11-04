<?php namespace SleepingOwl\Admin\Columns\Column;

use SleepingOwl\Admin\Admin;
use SleepingOwl\Html\FormBuilder;
use Lang;
use SleepingOwl\Models\Interfaces\ModelWithOrderFieldInterface;

class Action extends BaseColumn
{
	/**
	 * @var \SleepingOwl\Admin\Router
	 */
	protected $router;
	/**
	 * @var FormBuilder
	 */
	protected $formBuilder;
	/**
	 * @var string
	 */
	protected $icon = null;
	/**
	 * @var string
	 */
	protected $style = 'long';
	/**
	 * @var string|\Closure
	 */
	protected $url;
	/**
	 * @var \Closure
	 */
	protected $callback;
	/**
	 * @var string
	 */
	protected $target;

	/**
	 *
	 */
	function __construct($name, $label = null)
	{
		parent::__construct($name, $label);
		$this->sortable = false;
		$admin = Admin::instance();
		$this->router = $admin->router;
		$this->formBuilder = $admin->formBuilder;
	}

	public function renderHeader()
	{
		return $this->htmlBuilder->tag('th', $this->getAttributesForHeader());
	}

	/**
	 * @param $instance
	 * @param int $totalCount
	 * @return string
	 */
	public function render($instance, $totalCount)
	{
		$buttons = [];
		$buttons[] = $this->button($instance);
		return $this->htmlBuilder->tag('td', ['class' => 'text-right'], implode(' ', $buttons));
	}

	/**
	 * @param $instance
	 * @return string
	 */
	protected function button($instance)
	{
		if ( ! is_null($this->url))
		{
			if (is_callable($this->url))
			{
				$callback = $this->url;
				$url = $callback($instance);
			} else
			{
				$url = strtr($this->url, [':id' => $instance->id]);
			}
		} else
		{
			$url = $this->router->routeToTable($this->modelItem->getAlias(), [
				'action' => $this->name,
				'id'     => $instance->id
			]);
		}
		$attributes = [
			'class'       => 'btn btn-default btn-sm',
			'href'        => $url,
			'data-toggle' => 'tooltip',
		];
		$content = '';
		if ( ! is_null($this->icon))
		{
			$content .= '<i class="fa ' . $this->icon . '"></i>';
		}
		if ($this->style === 'long')
		{
			$content .= ' ' . $this->label;
		} else
		{
			$attributes['title'] = $this->label;
		}
		if ( ! is_null($this->target))
		{
			$attributes['target'] = $this->target;
		}
		return $this->htmlBuilder->tag('a', $attributes, $content);
	}

	/**
	 * @param string $icon
	 * @return $this
	 */
	public function icon($icon)
	{
		$this->icon = $icon;
		return $this;
	}

	/**
	 * @param string $style
	 * @return $this
	 */
	public function style($style)
	{
		$this->style = $style;
		return $this;
	}

	/**
	 * @param string|\Closure $url
	 * @return $this
	 */
	public function url($url)
	{
		$this->url = $url;
		return $this;
	}

	/**
	 * @param callable $callback
	 * @return $this
	 */
	public function callback($callback)
	{
		$this->callback = $callback;
		return $this;
	}

	public function call($instance)
	{
		$callback = $this->callback;
		return $callback($instance);
	}

	/**
	 * @param string $target
	 * @return $this
	 */
	public function target($target)
	{
		$this->target = $target;
		return $this;
	}

}