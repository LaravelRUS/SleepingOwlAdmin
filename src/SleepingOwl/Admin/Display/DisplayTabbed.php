<?php namespace SleepingOwl\Admin\Display;

use AdminTemplate;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Interfaces\DisplayInterface;
use SleepingOwl\Admin\Interfaces\FormInterface;

class DisplayTabbed implements Renderable, DisplayInterface, FormInterface
{

	protected $tabs = [];

	public function tabs($tabs = null)
	{
		if (is_null($tabs))
		{
			return $this->tabs;
		}
		if (is_callable($tabs))
		{
			$tabs = call_user_func($tabs);
		}
		$this->tabs = $tabs;
		return $this;
	}

	public function render()
	{
		$params = [
			'tabs' => $this->tabs(),
		];
		return view(AdminTemplate::view('display.tabbed'), $params);
	}

	function __toString()
	{
		return (string)$this->render();
	}

	public function setClass($class)
	{
		foreach ($this->tabs as $tab)
		{
			if ($tab instanceof DisplayInterface)
			{
				$tab->setClass($class);
			}
		}
	}

	public function initialize()
	{
		foreach ($this->tabs as $tab)
		{
			if ($tab instanceof DisplayInterface)
			{
				$tab->initialize();
			}
		}
	}

	public function setAction($action)
	{
		foreach ($this->tabs as $tab)
		{
			if ($tab instanceof FormInterface)
			{
				$tab->setAction($action);
			}
		}
	}

	public function setId($id)
	{
		foreach ($this->tabs as $tab)
		{
			if ($tab instanceof FormInterface)
			{
				$tab->setId($id);
			}
		}
	}

	public function validate($model)
	{
		foreach ($this->tabs as $tab)
		{
			if ($tab instanceof FormInterface)
			{
				$result = $tab->validate($model);
				if ( ! is_null($result))
				{
					return $result;
				}
			}
		}
		return null;
	}

	public function save()
	{
		foreach ($this->tabs as $tab)
		{
			if ($tab instanceof FormInterface)
			{
				$tab->save();
			}
		}
	}

}