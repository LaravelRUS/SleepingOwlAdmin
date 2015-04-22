<?php namespace SleepingOwl\Admin\FormItems;

class View extends Custom
{

	protected $view;

	function __construct($view)
	{
		$this->view($view);
	}

	public function save()
	{
		$callback = $this->callback();
		if (is_callable($callback))
		{
			call_user_func($callback, $this->instance());
		}
	}

	public function view($view = null)
	{
		if (is_null($view))
		{
			return $this->view;
		}
		$this->view = $view;
		$this->display(function ($instance)
		{
			return view($this->view(), ['instance' => $instance]);
		});
		return $this;
	}

}