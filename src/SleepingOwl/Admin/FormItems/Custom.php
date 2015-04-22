<?php namespace SleepingOwl\Admin\FormItems;

class Custom extends BaseFormItem
{

	protected $display;
	protected $callback;

	public function display($display = null)
	{
		if (is_null($display))
		{
			if (is_callable($this->display))
			{
				return call_user_func($this->display, $this->instance());
			}
			return $this->display;
		}
		$this->display = $display;
		return $this;
	}

	public function callback($callback = null)
	{
		if (is_null($callback))
		{
			return $this->callback;
		}
		$this->callback = $callback;
		return $this;
	}

	public function render()
	{
		return $this->display();
	}

	public function save()
	{
		$callback = $this->callback();
		if (is_callable($callback))
		{
			call_user_func($callback, $this->instance());
		}
	}

}