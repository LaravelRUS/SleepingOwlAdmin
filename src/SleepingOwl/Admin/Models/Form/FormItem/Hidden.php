<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

class Hidden extends BaseFormItem
{
	public function render()
	{
		return $this->formBuilder->hidden($this->name, $this->getValueFromForm(), $this->attributes);
	}

} 