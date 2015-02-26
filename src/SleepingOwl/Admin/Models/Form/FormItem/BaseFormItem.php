<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

use SleepingOwl\Admin\Admin;
use SleepingOwl\Admin\Exceptions\MethodNotFoundException;
use SleepingOwl\Html\FormBuilder;
use SleepingOwl\Admin\Models\Form\Interfaces\FormItemInterface;
use SleepingOwl\Admin\Models\Form\Form;
use SleepingOwl\Admin\Models\ModelItem;

/**
 * Class BaseFormItem
 * @package SleepingOwl\Admin\Models\Form\FormItem
 * @method $this default($value)
 */
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
	/**
	 * @var string
	 */
	protected $name;
	/**
	 * @var string
	 */
	protected $label;
	/**
	 * @var array
	 */
	protected $validation = [];

	/**
	 * @var array
	 */
	protected $attributes = [];

	/**
	 * @var mixed
	 */
	protected $default = null;

	/**
	 * @param null $name
	 * @param null $label
	 */
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

	/**
	 * @return string
	 */
	public function getName()
	{
		return $this->name;
	}

	/**
	 * @return mixed
	 */
	protected function getValueFromForm()
	{
		return $this->form->getValueForName($this->name);
	}

	public function required($onlyOnCreate = false)
	{
		if ($onlyOnCreate)
		{
			$this->validationRule('required_only_on_create');
		} else
		{
			$this->validationRule('required');
		}
		return $this;
	}

	public function unique()
	{
		$table = ModelItem::$current->getModelTable();
		return $this->validationRule('unique:' . $table . ',' . $this->name);
	}

	public function validationRule($rule)
	{
		$rules = explode('|', $rule);
		foreach ($rules as $rule)
		{
			$this->validation[] = $rule;
		}
		return $this;
	}

	public function getValidationRules()
	{
		return $this->validation;
	}

	public function attributes($attributes)
	{
		$this->attributes = $attributes;
	}

	function __call($name, $arguments)
	{
		if ($name == 'default')
		{
			return call_user_func_array([$this, 'setDefault'], $arguments);
		}
		throw new MethodNotFoundException(get_class($this), $name);
	}

	/**
	 * @param mixed $default
	 * @return $this
	 */
	public function setDefault($default)
	{
		$this->default = $default;
		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getDefault()
	{
		return $this->default;
	}

	/**
	 * @param array $data
	 */
	public function updateRequestData(&$data)
	{

	}

}