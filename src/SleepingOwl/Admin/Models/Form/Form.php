<?php namespace SleepingOwl\Admin\Models\Form;

use SleepingOwl\Admin\Admin;
use SleepingOwl\Admin\Models\Form\Interfaces\FormItemInterface;
use Illuminate\Support\Arr;
use Illuminate\Support\ViewErrorBag;

/**
 * Class Form
 * @package SleepingOwl\Admin\Models\Form
 */
class Form
{
	/**
	 * @var FormItemInterface[]
	 */
	protected $items;
	/**
	 * @var \SleepingOwl\Html\FormBuilder
	 */
	protected $formBuilder;
	/**
	 * @var
	 */
	public $instance;
	/**
	 * @var string
	 */
	protected $method;
	/**
	 * @var string
	 */
	protected $saveUrl;
	/**
	 * @var string
	 */
	protected $backUrl;
	/**
	 * @var ViewErrorBag
	 */
	protected $errors;
	/**
	 * @var array
	 */
	protected $values;

	function __construct()
	{
		$this->formBuilder = Admin::instance()->formBuilder;
		$this->items = [];
	}

	/**
	 * @return mixed
	 */
	public function getInstance()
	{
		return $this->instance;
	}

	/**
	 * @param mixed $instance
	 */
	public function setInstance($instance)
	{
		$this->instance = $instance;
		$this->setDefaults();
	}

	/**
	 * Set default values for instance
	 */
	public function setDefaults()
	{
		foreach ($this->items as $item)
		{
			$name = $item->getName();
			if ( ! is_null($name) && ! isset($this->instance->$name))
			{
				$this->instance->$name = $item->getDefault();
			}
		}
	}

	/**
	 * @param mixed $method
	 */
	public function setMethod($method)
	{
		$this->method = $method;
	}

	/**
	 * @param mixed $saveUrl
	 */
	public function setSaveUrl($saveUrl)
	{
		$this->saveUrl = $saveUrl;
	}

	/**
	 * @param mixed $errors
	 */
	public function setErrors($errors)
	{
		if (is_null($errors))
		{
			$errors = new ViewErrorBag;
		}
		$this->errors = $errors;
	}

	/**
	 * @param mixed $backUrl
	 */
	public function setBackUrl($backUrl)
	{
		$this->backUrl = $backUrl;
	}

	/**
	 * @return string
	 */
	public function render()
	{
		$content = [];
		$content[] = $this->formBuilder->model($this->instance, [
			'method' => $this->method,
			'url'    => $this->saveUrl,
			'errors' => $this->errors
		]);
		foreach ($this->items as $item)
		{
			$content[] = $item->render();
		}
		$content[] = $this->formBuilder->submitGroup($this->backUrl);
		$content[] = $this->formBuilder->close();

		return implode('', $content);
	}

	/**
	 * @return string
	 */
	public function __toString()
	{
		return $this->render();
	}

	/**
	 * @param $values
	 */
	public function setValues($values)
	{
		$this->values = $values;
	}

	public function getValueForName($name)
	{
		return Arr::get($this->values, $name, null);
	}

	public function addItem($item)
	{
		$this->items[] = $item;
	}

	public function getValidationRules()
	{
		$rules = [];
		foreach ($this->items as $item)
		{
			$rules[$item->getName()] = $item->getValidationRules();
		}
		return $rules;
	}

	public function updateRequestData(&$data)
	{
		foreach ($this->items as $item)
		{
			$item->updateRequestData($data);
		}
	}

}