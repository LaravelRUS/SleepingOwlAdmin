<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

class Checkbox extends BaseFormItem
{
	public function render()
	{
		return $this->formBuilder->checkboxGroup($this->name, $this->label, $this->getValueFromForm(), $this->attributes);
	}
} 