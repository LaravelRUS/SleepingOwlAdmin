<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

class Date extends BaseTime
{
	public function render()
	{
		$this->attributes['data-date-picktime'] = false;
		return $this->formBuilder->datetime($this->name, $this->label, $this->getValueFromForm(), $this->attributes);
	}

	public function getValidationRules()
	{
		$rules = parent::getValidationRules();
		$rules[] = 'date:locale';
		return $rules;
	}
} 