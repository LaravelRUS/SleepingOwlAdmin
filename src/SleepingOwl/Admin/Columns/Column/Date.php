<?php namespace SleepingOwl\Admin\Columns\Column;

use App;
use Carbon\Carbon;
use IntlDateFormatter;
use SleepingOwl\DateFormatter\DateFormatter;

class Date extends BaseColumn
{

	/**
	 * @var array
	 */
	public static $formats = [
		'none'   => -1,
		'full'   => 0,
		'long'   => 1,
		'medium' => 2,
		'short'  => 3,
	];

	/**
	 * @var int
	 */
	protected $formatDate = 2;

	/**
	 * @var int
	 */
	protected $formatTime = -1;

	/**
	 * @param int $formatDate
	 * @return $this
	 */
	public function formatDate($formatDate)
	{
		if ( ! isset(static::$formats[$formatDate])) throw new \InvalidArgumentException;
		$this->formatDate = static::$formats[$formatDate];
		return $this;
	}

	/**
	 * @param int $formatTime
	 * @return $this
	 */
	public function formatTime($formatTime)
	{
		if ( ! isset(static::$formats[$formatTime])) throw new \InvalidArgumentException;
		$this->formatTime = static::$formats[$formatTime];
		return $this;
	}

	/**
	 * @param $formatDate
	 * @param $formatTime
	 */
	public function format($formatDate, $formatTime)
	{
		$this->formatDate($formatDate);
		$this->formatTime($formatTime);
	}

	/**
	 * @param $instance
	 * @return array
	 */
	protected function getAttributesForCell($instance)
	{
		return [
			'class'      => 'column-date',
			'data-order' => $this->valueFromInstance($instance, $this->name),
		];
	}

	/**
	 * @param $instance
	 * @param int $totalCount
	 * @return string
	 */
	public function render($instance, $totalCount)
	{
		$date = $this->valueFromInstance($instance, $this->name);
		$formattedDate = '';
		if ( ! is_null($date))
		{
			$formattedDate = DateFormatter::format($date, $this->formatDate, $this->formatTime);
		}

		return parent::render($instance, $totalCount, $formattedDate);
	}


}