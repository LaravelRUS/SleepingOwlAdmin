<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

class Image extends BaseFormItem
{
	public function render()
	{
		return $this->formBuilder->imageGroup($this->name, $this->label, $this->form->getInstance(), $this->attributes);
	}

	public function getValidationRules()
	{
		$rules = parent::getValidationRules();
		$rules[] = 'image';
		return $rules;
	}

} 