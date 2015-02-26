<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

use SleepingOwl\DateFormatter\DateFormatter;

class Time extends BaseTime
{
	/**
	 * @var bool
	 */
	protected $showSeconds = false;

	/**
	 * @param mixed $showSeconds
	 * @return $this
	 */
	public function seconds($showSeconds)
	{
		$this->showSeconds = $showSeconds;
		return $this;
	}

	/**
	 * @return mixed
	 */
	public function render()
	{
		$this->attributes['data-date-pickdate'] = 'false';
		$this->attributes['data-date-useseconds'] = $this->showSeconds;
		return $this->formBuilder->datetime($this->name, $this->label, $this->getValueFromForm(), $this->attributes, DateFormatter::NONE, $this->showSeconds ? DateFormatter::MEDIUM : DateFormatter::SHORT);
	}
}