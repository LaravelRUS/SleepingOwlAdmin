<?php namespace SleepingOwl\Admin\Display;

use AdminTemplate;
use Closure;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Interfaces\DisplayInterface;
use SleepingOwl\Admin\Interfaces\FormInterface;

class DisplayTabbed implements Renderable, DisplayInterface, FormInterface
{

	/**
	 * Added tabs
	 * @var DisplayTab[]
	 */
	protected $tabs = [];

	/**
	 * Get or set tabs
	 * @param Closure|DisplayTab[]|null $tabs
	 * @return $this|DisplayTab[]
	 */
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

	/**
	 * @return \Illuminate\View\View
	 */
	public function render()
	{
		$params = [
			'tabs' => $this->tabs(),
		];
		return view(AdminTemplate::view('display.tabbed'), $params);
	}

	/**
	 * @return string
	 */
	function __toString()
	{
		return (string)$this->render();
	}

	/**
	 * @param string $class
	 */
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

	/**
	 *
	 */
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

	/**
	 * @param string $action
	 */
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

	/**
	 * @param int $id
	 */
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

	/**
	 * @param mixed $model
	 * @return null
	 */
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

	/**
	 * @param mixed $model
	 */
	public function save($model)
	{
		foreach ($this->tabs as $tab)
		{
			if ($tab instanceof FormInterface)
			{
				$tab->save($model);
			}
		}
	}

}