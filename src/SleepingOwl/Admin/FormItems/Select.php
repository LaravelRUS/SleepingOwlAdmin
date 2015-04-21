<?php namespace SleepingOwl\Admin\FormItems;

use SleepingOwl\Admin\AssetManager\AssetManager;
use SleepingOwl\Admin\Repository\BaseRepository;

class Select extends NamedFormItem
{

	protected $view = 'select';
	protected $model;
	protected $display = 'title';
	protected $options = [];
	protected $nullable = false;

	public function initialize()
	{
		parent::initialize();

		AssetManager::addStyle('admin::default/css/bootstrap-multiselect.css');
		AssetManager::addScript('admin::default/js/bootstrap-multiselect.js');
		AssetManager::addScript('admin::default/js/formitems/select.js');
	}

	public function model($model = null)
	{
		if (is_null($model))
		{
			return $this->model;
		}
		$this->model = $model;
		return $this;
	}

	public function display($display = null)
	{
		if (is_null($display))
		{
			return $this->display;
		}
		$this->display = $display;
		return $this;
	}

	public function options($options = null)
	{
		if (is_null($options))
		{
			if ( ! is_null($this->model()) && ! is_null($this->display()))
			{
				$this->loadOptions();
			}
			return $this->options;
		}
		$this->options = $options;
		return $this;
	}

	protected function loadOptions()
	{
		$repository = new BaseRepository($this->model());
		$key = $repository->model()->getKeyName();
		$options = $repository->query()->get()->lists($this->display(), $key);
		$this->options($options);
	}

	public function getParams()
	{
		return parent::getParams() + [
			'options'  => $this->options(),
			'nullable' => $this->isNullable(),
		];
	}

	public function enum($values)
	{
		return $this->options(array_combine($values, $values));
	}

	public function nullable($nullable = true)
	{
		$this->nullable = $nullable;
		return $this;
	}

	public function isNullable()
	{
		return $this->nullable;
	}

}