<?php namespace SleepingOwl\Admin\Display;

use AdminTemplate;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Interfaces\DisplayInterface;
use SleepingOwl\Admin\Interfaces\FormInterface;

class DisplayTab implements Renderable, DisplayInterface, FormInterface
{

	protected $label = [];
	protected $active = false;
	protected $name;
	protected $content;

	function __construct($content)
	{
		$this->content = $content;
	}

	public function label($label = null)
	{
		if (is_null($label))
		{
			return $this->label;
		}
		$this->label = $label;
		return $this;
	}

	public function render()
	{
		$params = [
			'label' => $this->label(),
			'active' => $this->active(),
			'name' => $this->name(),
		];
		return view(AdminTemplate::view('display.tab'), $params);
	}

	function __toString()
	{
		return (string) $this->render();
	}

	public function active($active = null)
	{
		if (is_null($active))
		{
			return $this->active;
		}
		$this->active = $active;
		return $this;
	}

	public function name($name = null)
	{
		if (is_null($name))
		{
			return (is_null($this->name)) ? md5($this->label) : $this->name;
		}
		$this->name = $name;
		return $this;
	}

	public function content()
	{
		$params = [
			'active' => $this->active(),
			'name' => $this->name(),
			'content' => $this->content,
		];
		return view(AdminTemplate::view('display.tab_content'), $params);
	}

	public function setClass($class)
	{
		if ($this->content instanceof DisplayInterface)
		{
			$this->content->setClass($class);
		}
	}

	public function initialize()
	{
		if ($this->content instanceof DisplayInterface)
		{
			$this->content->initialize();
		}
	}

	public function setAction($action)
	{
		if ($this->content instanceof FormInterface)
		{
			$this->content->setAction($action);
		}
	}

	public function setId($id)
	{
		if ($this->content instanceof FormInterface)
		{
			$this->content->setId($id);
		}
	}

	public function validate($model)
	{
		if ($this->content instanceof FormInterface)
		{
			return $this->content->validate($model);
		}
		return null;
	}

	public function save()
	{
		if ($this->content instanceof FormInterface)
		{
			$this->content->save();
		}
	}

}