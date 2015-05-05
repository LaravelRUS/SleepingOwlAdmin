<?php namespace SleepingOwl\Admin\ColumnFilters;

use SleepingOwl\Admin\AssetManager\AssetManager;

class Date extends Text
{

	protected $view = 'date';
	protected $format;
	protected $seconds = false;
	protected $pickerFormat;
	protected $width = 150;

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
				$this->format(config('admin.datetimeFormat'));
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

	public function getParams()
	{
		return parent::getParams() + [
			'seconds'      => $this->seconds(),
			'format'       => $this->format(),
			'pickerFormat' => $this->pickerFormat(),
			'width'        => $this->width(),
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

	public function width($width = null)
	{
		if (is_null($width))
		{
			return $this->width;
		}
		$this->width = $width;
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