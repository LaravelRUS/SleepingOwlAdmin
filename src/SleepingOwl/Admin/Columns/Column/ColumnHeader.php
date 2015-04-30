<?php namespace SleepingOwl\Admin\Columns\Column;

use AdminTemplate;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\View\View;

class ColumnHeader implements Renderable
{

	/**
	 * Header title
	 * @var string
	 */
	protected $title;
	/**
	 * Is column orderable?
	 * @var bool
	 */
	protected $orderable = true;

	/**
	 * Get or set title
	 * @param string|null $title
	 * @return $this|string
	 */
	public function title($title = null)
	{
		if (is_null($title))
		{
			return $this->title;
		}
		$this->title = $title;
		return $this;
	}

	/**
	 * Get or set column orderable feature
	 * @param bool|null $orderable
	 * @return $this|bool
	 */
	public function orderable($orderable = null)
	{
		if (is_null($orderable))
		{
			return $this->orderable;
		}
		$this->orderable = $orderable;
		return $this;
	}

	/**
	 * @return View
	 */
	public function render()
	{
		$params = [
			'title'     => $this->title(),
			'orderable' => $this->orderable(),
		];
		return view(AdminTemplate::view('column.header'), $params);
	}

	/**
	 * @return string
	 */
	function __toString()
	{
		return (string)$this->render();
	}

}