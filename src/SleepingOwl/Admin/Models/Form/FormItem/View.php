<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

use View as IlluminateView;

class View extends BaseFormItem
{
	protected $view;

	function __construct($name = null, $label = null)
	{
		parent::__construct($name, $label);
		$this->view = $name;
	}

	public function render()
	{
		if (!IlluminateView::exists($this->view))
		{
			throw new \Exception('View [' . $this->view . '] doesnt exist');
		}
		return IlluminateView::make($this->view);
	}

} 