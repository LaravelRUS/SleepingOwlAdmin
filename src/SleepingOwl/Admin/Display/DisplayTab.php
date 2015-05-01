<?php namespace SleepingOwl\Admin\Display;

use AdminTemplate;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\View\View;
use SleepingOwl\Admin\Interfaces\DisplayInterface;
use SleepingOwl\Admin\Interfaces\FormInterface;

class DisplayTab implements Renderable, DisplayInterface, FormInterface
{

	/**
	 * Tab label
	 * @var string
	 */
	protected $label = '';
	/**
	 * Is tab active by default?
	 * @var bool
	 */
	protected $active = false;
	/**
	 * Tab name
	 * @var string
	 */
	protected $name;
	/**
	 * Tab content
	 * @var Renderable
	 */
	protected $content;

	/**
	 * @param $content
	 */
	function __construct($content)
	{
		$this->content = $content;
	}

	/**
	 * Get or set tab label
	 * @param null $label
	 * @return $this|array
	 */
	public function label($label = null)
	{
		if (is_null($label))
		{
			return $this->label;
		}
		$this->label = $label;
		return $this;
	}

	/**
	 * Get or set tab active state
	 * @param null $active
	 * @return $this|bool
	 */
	public function active($active = null)
	{
		if (is_null($active))
		{
			return $this->active;
		}
		$this->active = $active;
		return $this;
	}

	/**
	 * Get or set tab name
	 * @param null $name
	 * @return $this|string
	 */
	public function name($name = null)
	{
		if (is_null($name))
		{
			return (is_null($this->name)) ? md5($this->label) : $this->name;
		}
		$this->name = $name;
		return $this;
	}

	/**
	 * Get tab original content
	 * @return mixed
	 */
	public function getOriginalContent()
	{
		return $this->content;
	}

	/**
	 * Render tab content
	 * @return View
	 */
	public function content()
	{
		$params = [
			'active' => $this->active(),
			'name' => $this->name(),
			'content' => $this->content,
		];
		return view(AdminTemplate::view('display.tab_content'), $params);
	}

	/**
	 * @param string $class
	 */
	public function setClass($class)
	{
		if ($this->content instanceof DisplayInterface)
		{
			$this->content->setClass($class);
		}
	}

	/**
	 * Initialize tab
	 */
	public function initialize()
	{
		if ($this->content instanceof DisplayInterface)
		{
			$this->content->initialize();
		}
	}

	/**
	 * @param string $action
	 */
	public function setAction($action)
	{
		if ($this->content instanceof FormInterface)
		{
			$this->content->setAction($action);
		}
	}

	/**
	 * @param int $id
	 */
	public function setId($id)
	{
		if ($this->content instanceof FormInterface)
		{
			$this->content->setId($id);
		}
	}

	/**
	 * @param mixed $model
	 * @return null
	 */
	public function validate($model)
	{
		if ($this->content instanceof FormInterface)
		{
			return $this->content->validate($model);
		}
		return null;
	}

	/**
	 * @param mixed $model
	 */
	public function save($model)
	{
		if ($this->content instanceof FormInterface)
		{
			$this->content->save($model);
		}
	}

	/**
	 * @return View
	 */
	public function render()
	{
		$params = [
			'label' => $this->label(),
			'active' => $this->active(),
			'name' => $this->name(),
		];
		return view(AdminTemplate::view('display.tab'), $params);
	}

	/**
	 * @return string
	 */
	function __toString()
	{
		return (string) $this->render();
	}

}