<?php namespace SleepingOwl\Admin\FormItems;

class TextAddon extends NamedFormItem
{

	protected $view = 'textaddon';
	protected $placement = 'before';
	protected $addon;

	public function placement($placement = null)
	{
		if (is_null($placement))
		{
			return $this->placement;
		}
		$this->placement = $placement;
		return $this;
	}

	public function addon($addon = null)
	{
		if (is_null($addon))
		{
			return $this->addon;
		}
		$this->addon = $addon;
		return $this;
	}

	public function getParams()
	{
		return parent::getParams() + [
			'placement' => $this->placement(),
			'addon'     => $this->addon(),
		];
	}


}