<?php namespace SleepingOwl\DateFormatter;

use App;
use Carbon\Carbon;

class DateFormatter
{
	const FULL = 0;
	const LONG = 1;
	const MEDIUM = 2;
	const SHORT = 3;
	const NONE = -1;

	public static function format($date, $dateFormat = self::SHORT, $timeFormat = self::NONE)
	{
		if ( ! $date instanceof Carbon)
		{
			try
			{
				$date = new Carbon($date);
			} catch (\Exception $e)
			{
				return null;
			}
		}
		if ( ! function_exists('datefmt_create'))
		{
			throw new \Exception('You must install "intl" php extension.');
		}
		$formatter = datefmt_create(App::getLocale(), $dateFormat, $timeFormat);
		$pattern = $formatter->getPattern();
		$pattern = str_replace('yy', 'y', $pattern);
		$formatter->setPattern($pattern);

		return $formatter->format($date);
	}

} 