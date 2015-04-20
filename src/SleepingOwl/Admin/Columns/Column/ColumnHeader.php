<?php namespace SleepingOwl\Admin\Columns\Column;

use AdminTemplate;
use Illuminate\Contracts\Support\Renderable;

class ColumnHeader implements Renderable
{

	protected $title;
	protected $orderable = true;

	public function title($title = null)
	{
		if (is_null($title))
		{
			return $this->title;
		}
		$this->title = $title;
		return $this;
	}

	public function orderable($orderable = null)
	{
		if (is_null($orderable))
		{
			return $this->orderable;
		}
		$this->orderable = $orderable;
		return $this;
	}

	public function render()
	{
		$params = [
			'title'     => $this->title(),
			'orderable' => $this->orderable(),
		];
		return view(AdminTemplate::view('column.header'), $params);
	}

	function __toString()
	{
		return (string)$this->render();
	}

}