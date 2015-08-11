<?php namespace SleepingOwl\Admin\FormItems;

use Input;

abstract class NamedFormItem extends BaseFormItem
{

	protected $path;
	protected $name;
	protected $attribute;
	protected $label;
	protected $defaultValue;
	protected $readonly;

	function __construct($path, $label = null)
	{
		$this->label = $label;
		$parts = explode(".", $path);
		if (count($parts) > 1) {
			$this->path = $path;
			$this->name = $parts[0] . "[" . implode("][", array_slice($parts, 1)) . "]";
			$this->attribute = implode(".", array_slice(explode(".", $path), -1, 1));
		} else {
			$this->path = $path;
			$this->name = $path;
			$this->attribute = $path;
		}
	}

	public function path($path = null)
	{
		if (is_null($path))
		{
			return $this->path;
		}
		$this->path = $path;
		return $path;
	}

	public function attribute($attribute = null)
	{
		if (is_null($attribute))
		{
			return $this->attribute;
		}
		$this->attribute = $attribute;
		return $attribute;
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
			'name'      => $this->name(),
			'label'     => $this->label(),
			'readonly'  => $this->readonly(),
			'value'     => $this->value()
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

	public function readonly($readonly = null)
	{
		if (is_null($readonly))
		{
			return $this->readonly;
		}

		$this->readonly = $readonly;

		return $this;
	}

	public function value()
	{
		$instance = $this->instance();
		if ( ! is_null($value = old($this->path())))
		{
			return $value;
		}
		$input = Input::all();
		if (($value = array_get($input, $this->path())) !== null)
		{
			return $value;
		}
		if ( ! is_null($instance) && ! is_null($value = $instance->getAttribute($this->attribute())))
		{
			return $value;
		}
		return $this->defaultValue();
	}

	public function save()
	{
		$attribute = $this->attribute();
		if (Input::get($this->path()) === null) {
			$value = null;
		} else {
			$value = $this->value();
		}
		$this->instance()->$attribute = $value;
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
				$item = 'unique:' . $table . ',' . $this->attribute();
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
