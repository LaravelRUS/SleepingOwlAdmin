<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

use SleepingOwl\DateFormatter\DateFormatter;

class Timestamp extends Time
{
	/**
	 * @return mixed
	 */
	public function render()
	{
		return $this->formBuilder->datetime($this->name, $this->label, $this->getValueFromForm(), [
			'data-date-useseconds' => $this->showSeconds,
		], DateFormatter::SHORT, $this->showSeconds ? DateFormatter::MEDIUM : DateFormatter::SHORT);
	}
}