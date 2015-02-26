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

	/**
	 * @param array $data
	 */
	public function updateRequestData(&$data)
	{
		foreach ($data as $key => &$value)
		{
			if ( ! is_string($value)) continue;
			if (preg_match('/^(?<field>[a-zA-Z0-9]+)ConfirmDelete$/', $key, $matches))
			{
				$field = $matches['field'];
				if (is_null($data[$field]))
				{
					$data[$field] = '';
				}
			}
		}
	}

} 