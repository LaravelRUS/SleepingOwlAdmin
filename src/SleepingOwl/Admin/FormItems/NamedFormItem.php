<?php namespace SleepingOwl\Admin\FormItems;

use Input;

abstract class NamedFormItem extends BaseFormItem
{

	protected $name;
	protected $label;
	protected $defaultValue;

	function __construct($name, $label = null)
	{
		$this->label = $label;
		$this->name = $name;
	}

	public function name($name = null)
	{
		if (is_null($name))
		{
			return $this->name;
		}
		$this->name = $name;
		return $this;
	}

	public function label($label = null)
	{
		if (is_null($label))
		{
			return $this->label;
		}
		$this->label = $label;
		return $this;
	}

	public function getParams()
	{
		return parent::getParams() + [
			'name'  => $this->name(),
			'label' => $this->label(),
			'value' => $this->value(),
		];
	}

	public function defaultValue($defaultValue = null)
	{
		if (is_null($defaultValue))
		{
			return $this->defaultValue;
		}
		$this->defaultValue = $defaultValue;
		return $this;
	}

	public function value()
	{
		$instance = $this->instance();
		if ( ! is_null($value = old($this->name())))
		{
			return $value;
		}
		$input = Input::all();
		if (array_key_exists($this->name, $input))
		{
			return Input::get($this->name());
		}
		if ( ! is_null($instance) && ! is_null($value = $instance->getAttribute($this->name())))
		{
			return $value;
		}
		return $this->defaultValue();
	}

	public function save()
	{
		$name = $this->name();
		if ( ! Input::has($name))
		{
			Input::merge([$name => null]);
		}
		$this->instance()->$name = $this->value();
	}

	public function required()
	{
		return $this->validationRule('required');
	}

	public function unique()
	{
		return $this->validationRule('_unique');
	}

	public function getValidationRules()
	{
		$rules = parent::getValidationRules();
		array_walk($rules, function (&$item)
		{
			if ($item == '_unique')
			{
				$table = $this->instance()->getTable();
				$item = 'unique:' . $table . ',' . $this->name();
				if ($this->instance()->exists())
				{
					$item .= ',' . $this->instance()->getKey();
				}
			}
		});
		return [
			$this->name() => $rules
		];
	}

}