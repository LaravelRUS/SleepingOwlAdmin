<?php namespace SleepingOwl\Admin\FormItems;

use AdminTemplate;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Interfaces\FormItemInterface;

abstract class BaseFormItem implements Renderable, FormItemInterface
{

	protected $view;
	protected $instance;
	protected $validationRules = [];

	public function initialize()
	{
	}

	public function setInstance($instance)
	{
		return $this->instance($instance);
	}

	public function instance($instance = null)
	{
		if (is_null($instance))
		{
			return $this->instance;
		}
		$this->instance = $instance;
		return $this;
	}

	public function validationRules($validationRules = null)
	{
		if (is_null($validationRules))
		{
			return $this->validationRules;
		}
		$this->validationRules = $validationRules;
		return $this;
	}

	public function getValidationRules()
	{
		return $this->validationRules();
	}

	public function validationRule($rule)
	{
		$this->validationRules[] = $rule;
		return $this;
	}

	public function save()
	{
	}

	public function getParams()
	{
		return [
			'instance' => $this->instance(),
		];
	}

	public function render()
	{
		$params = $this->getParams();
		return view(AdminTemplate::view('formitem.' . $this->view), $params);
	}

	function __toString()
	{
		return (string)$this->render();
	}

} 