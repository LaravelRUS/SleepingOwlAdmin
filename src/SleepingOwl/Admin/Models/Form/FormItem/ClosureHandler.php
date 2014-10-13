<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

class ClosureHandler extends BaseFormItem
{
	/**
	 * @var \Closure
	 */
	protected $handler;

	function __construct($handler)
	{
		parent::__construct(null, null);

		$this->handler = $handler;
	}

	/**
	 * @return string
	 */
	public function render()
	{
		$model = $this->formBuilder->getModel();
		$method = $this->handler;
		return $method($model);
	}
}