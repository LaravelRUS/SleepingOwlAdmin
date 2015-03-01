<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

use SleepingOwl\DateFormatter\DateFormatter;

class Timestamp extends Time
{
	/**
	 * @return mixed
	 */
	public function render()
	{
		$this->attributes['data-date-useseconds'] = $this->showSeconds;
		return $this->formBuilder->datetime($this->name, $this->label, $this->getValueFromForm(), $this->attributes, DateFormatter::SHORT, $this->showSeconds ? DateFormatter::MEDIUM : DateFormatter::SHORT);
	}

	public function getValidationRules()
	{
		$rules = parent::getValidationRules();
		$rules[] = 'date:locale';
		return $rules;
	}

}