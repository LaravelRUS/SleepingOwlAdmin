<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

class Date extends BaseFormItem
{
	public function render()
	{
		return $this->formBuilder->datetime($this->name, $this->label, $this->getValueFromForm(), [
			'data-date-picktime' => false
		]);
	}
} 