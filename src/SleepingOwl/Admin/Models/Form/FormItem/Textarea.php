<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

class Textarea extends BaseFormItem
{
	public function render()
	{
		return $this->formBuilder->textareaGroup($this->name, $this->label, $this->getValueFromForm(), $this->attributes);
	}
}