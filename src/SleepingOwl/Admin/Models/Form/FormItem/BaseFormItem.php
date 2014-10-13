<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

use SleepingOwl\Admin\Admin;
use SleepingOwl\Html\FormBuilder;
use SleepingOwl\Admin\Models\Form\Interfaces\FormItemInterface;
use SleepingOwl\Admin\Models\Form\Form;
use SleepingOwl\Admin\Models\ModelItem;

abstract class BaseFormItem implements FormItemInterface
{
	/**
	 * @var FormBuilder
	 */
	protected $formBuilder;
	/**
	 * @var Form
	 */
	protected $form;
	protected $name;
	protected $label;

	function __construct($name = null, $label = null)
	{
		$this->formBuilder = Admin::instance()->formBuilder;
		$this->label = $label;
		$this->name = $name;
		if ($modelItem = ModelItem::$current)
		{
			$this->form = $modelItem->getForm();
		}
	}

	protected function getValueFromForm()
	{
		return $this->form->getValueForName($this->name);
	}

}