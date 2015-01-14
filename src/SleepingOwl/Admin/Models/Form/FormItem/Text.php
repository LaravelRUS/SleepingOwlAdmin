<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

class Text extends BaseFormItem
{
	public function render()
	{
		return $this->formBuilder->textGroup($this->name, $this->label, $this->getValueFromForm(), $this->attributes);
	}
} 