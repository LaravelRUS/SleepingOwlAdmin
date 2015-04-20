<?php namespace SleepingOwl\Admin\FormItems;

use SleepingOwl\Admin\Interfaces\FormItemInterface;

class Columns extends BaseFormItem
{

	protected $view = 'columns';
	protected $columns = [];

	public function columns($columns = null)
	{
		if (is_null($columns))
		{
			return $this->columns;
		}
		$this->columns = $columns;
		return $this;
	}

	public function getParams()
	{
		return parent::getParams() + [
			'columns' => $this->columns(),
		];
	}

	public function getValidationRules()
	{
		$rules = parent::getValidationRules();
		foreach ($this->columns() as $columnItems)
		{
			foreach ($columnItems as $item)
			{
				if ($item instanceof FormItemInterface)
				{
					$rules += $item->getValidationRules();
				}
			}
		}
		return $rules;
	}

	public function save()
	{
		parent::save();
		$this->all(function ($item)
		{
			$item->save();
		});
	}

	public function initialize()
	{
		parent::initialize();
		$this->all(function ($item)
		{
			$item->initialize();
		});
	}

	public function setInstance($instance)
	{
		parent::setInstance($instance);
		$this->all(function ($item) use ($instance)
		{
			$item->setInstance($instance);
		});
		return $this->instance($instance);
	}

	protected function all($callback)
	{
		foreach ($this->columns() as $columnItems)
		{
			foreach ($columnItems as $item)
			{
				if ($item instanceof FormItemInterface)
				{
					$callback($item);
				}
			}
		}
	}

}