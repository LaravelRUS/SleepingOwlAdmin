<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

class Password extends BaseFormItem
{
	public function render()
	{
		return $this->formBuilder->passwordGroup($this->name, $this->label, $this->attributes);
	}
} 