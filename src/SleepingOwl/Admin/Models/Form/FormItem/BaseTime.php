<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

use Carbon\Carbon;

abstract class BaseTime extends BaseFormItem
{

	/**
	 * @return string
	 */
	public function render()
	{
	}

	/**
	 * @param array $data
	 */
	public function updateRequestData(&$data)
	{
		foreach ($data as $key => &$value)
		{
			if ( ! is_string($value)) continue;
			if ((strpos($value, 'AM') !== false) || (strpos($value, 'PM') !== false))
			{
				try
				{
					$time = new Carbon($value);
					$value = $time->format('Y-m-d H:i:s');
				} catch (\Exception $e)
				{
				}
			}
		}
	}

}