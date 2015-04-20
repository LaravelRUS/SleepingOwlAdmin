<?php namespace SleepingOwl\Admin\Columns\Column;

use AdminTemplate;

class Custom extends BaseColumn
{

	protected $callback;

	public function callback($callback = null)
	{
		if (is_null($callback))
		{
			return $this->callback;
		}
		$this->callback = $callback;
		return $this;
	}

	protected function getValue($instance)
	{
		if ( ! is_callable($this->callback()))
		{
			throw new \Exception('Invalid custom column callback');
		}
		return call_user_func($this->callback(), $instance);
	}

	public function render()
	{
		$params = [
			'value'  => $this->getValue($this->instance),
			'append' => $this->append(),
		];
		return view(AdminTemplate::view('column.custom'), $params);
	}

}