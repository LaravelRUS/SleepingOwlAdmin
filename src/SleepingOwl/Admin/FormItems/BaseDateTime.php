<?php namespace SleepingOwl\Admin\FormItems;

use Carbon\Carbon;
use SleepingOwl\Admin\AssetManager\AssetManager;

class BaseDateTime extends NamedFormItem
{

	protected $format;
	protected $seconds = false;
	protected $pickerFormat;
	protected $defaultConfigFormat = 'datetimeFormat';

	public function initialize()
	{
		parent::initialize();

		AssetManager::addStyle('admin::default/css/formitems/datetime/bootstrap-datetimepicker.min.css');
		AssetManager::addStyle('admin::default/css/formitems/datetime/style.css');

		AssetManager::addScript('admin::default/js/formitems/datetime/moment-with-locales.min.js');
		AssetManager::addScript('admin::default/js/formitems/datetime/s_bootstrap-datetimepicker.min.js');
		AssetManager::addScript('admin::default/js/formitems/datetime/init.js');
	}

	public function format($format = null)
	{
		if (is_null($format))
		{
			if (is_null($this->format))
			{
				$this->format(config('admin.' . $this->defaultConfigFormat));
			}
			return $this->format;
		}
		$this->format = $format;
		return $this;
	}

	public function seconds($seconds = null)
	{
		if (is_null($seconds))
		{
			return $this->seconds;
		}
		$this->seconds = $seconds;
		return $this;
	}

	public function value()
	{
		$value = parent::value();
		if (empty($value))
		{
			$value = null;
		}
		if ( ! is_null($value))
		{
			try
			{
				$time = Carbon::parse($value);
			} catch (\Exception $e)
			{
				try
				{
					$time = Carbon::createFromFormat($this->format(), $value);
				} catch (\Exception $e)
				{
					return null;
				}
			}
			$value = $time->format($this->format());
		}
		return $value;
	}

	public function save()
	{
		$name = $this->name();
		$value = parent::value();
		if (empty($value))
		{
			$value = null;
		}
		if ( ! is_null($value))
		{
			$value = Carbon::createFromFormat($this->format(), $value);
		}
		$this->instance()->$name = $value;
	}

	public function getParams()
	{
		return parent::getParams() + [
			'seconds'      => $this->seconds(),
			'format'       => $this->format(),
			'pickerFormat' => $this->pickerFormat(),
		];
	}

	public function pickerFormat($pickerFormat = null)
	{
		if (is_null($pickerFormat))
		{
			if (is_null($this->pickerFormat))
			{
				return $this->generatePickerFormat();
			}
			return $this->pickerFormat;
		}
		$this->pickerFormat = $pickerFormat;
		return $this;
	}

	protected function generatePickerFormat()
	{
		$format = $this->format();
		$replacement = [
			'i' => 'mm',
			's' => 'ss',
			'h' => 'hh',
			'H' => 'HH',
			'g' => 'h',
			'G' => 'H',
			'd' => 'DD',
			'j' => 'D',
			'm' => 'MM',
			'n' => 'M',
			'Y' => 'YYYY',
			'y' => 'YY',
		];
		return strtr($format, $replacement);
	}

} 