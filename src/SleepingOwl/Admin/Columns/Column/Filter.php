<?php namespace SleepingOwl\Admin\Columns\Column;

use AdminTemplate;
use SleepingOwl\Admin\Admin;

class Filter extends NamedColumn
{

	protected $model;
	protected $field;

	function __construct($name)
	{
		parent::__construct($name);
	}

	public function model($model = null)
	{
		if (is_null($model))
		{
			if (is_null($this->model))
			{
				$this->model(get_class($this->instance));
			}
			return $this->model;
		}
		$this->model = $model;
		return $this;
	}

	public function field($field = null)
	{
		if (is_null($field))
		{
			if (is_null($this->field))
			{
				$this->field($this->isSelf() ? $this->name() : 'id');
			}
			return $this->field;
		}
		$this->field = $field;
		return $this;
	}

	public function getUrl()
	{
		$value = $this->getValue($this->instance, $this->field());
		return Admin::model($this->model)->displayUrl([$this->name() => $value]);
	}

	protected function isSelf()
	{
		return get_class($this->instance) == $this->model();
	}

	public function render()
	{
		$params = [
			'isSelf' => $this->isSelf(),
			'url'    => $this->getUrl(),
			'value'  => $this->getValue($this->instance, $this->field()),
		];
		return view(AdminTemplate::view('column.filter'), $params);
	}

}