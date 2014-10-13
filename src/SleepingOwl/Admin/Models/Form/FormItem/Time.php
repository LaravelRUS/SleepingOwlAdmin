<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

use SleepingOwl\DateFormatter\DateFormatter;

class Time extends BaseFormItem
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
		return $this->formBuilder->datetime($this->name, $this->label, $this->getValueFromForm(), [
			'data-date-pickdate'   => 'false',
			'data-date-useseconds' => $this->showSeconds,
		], DateFormatter::NONE, $this->showSeconds ? DateFormatter::MEDIUM : DateFormatter::SHORT);
	}
}