<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

class Textarea extends BaseFormItem
{
	public function render($attributes = [])
	{
		return $this->formBuilder->textareaGroup($this->name, $this->label, $this->getValueFromForm(), $attributes);
	}
}