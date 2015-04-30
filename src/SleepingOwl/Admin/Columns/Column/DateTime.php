<?php namespace SleepingOwl\Admin\Columns\Column;

use AdminTemplate;
use Carbon\Carbon;
use Illuminate\View\View;

class DateTime extends NamedColumn
{

	/**
	 * Datetime format
	 * @var string
	 */
	protected $format;

	/**
	 * Get or set datetime format
	 * @param string|null $format
	 * @return $this|string
	 */
	public function format($format = null)
	{
		if (is_null($format))
		{
			if (is_null($this->format))
			{
				$this->format(config('admin.datetimeFormat'));
			}
			return $this->format;
		}
		$this->format = $format;
		return $this;
	}

	/**
	 * @return View
	 */
	public function render()
	{
		$value = $this->getValue($this->instance, $this->name());
		$originalValue = $value;
		if ( ! is_null($value))
		{
			if ( ! $value instanceof Carbon)
			{
				$value = Carbon::parse($value);
			}
			$value = $value->format($this->format());
		}
		$params = [
			'value'         => $value,
			'originalValue' => $originalValue,
			'append'        => $this->append(),
		];
		return view(AdminTemplate::view('column.datetime'), $params);
	}

}