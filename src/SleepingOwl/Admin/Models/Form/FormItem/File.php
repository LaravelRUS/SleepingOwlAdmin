<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

class File extends BaseFormItem
{
	public function render()
	{
		return $this->formBuilder->fileGroup($this->name, $this->label, $this->form->getInstance(), $this->attributes);
	}

} 