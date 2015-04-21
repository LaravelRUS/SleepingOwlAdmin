<?php namespace SleepingOwl\Admin\Form;

use AdminTemplate;
use Illuminate\Contracts\Support\Renderable;
use Input;
use SleepingOwl\Admin\Admin;
use SleepingOwl\Admin\Interfaces\DisplayInterface;
use SleepingOwl\Admin\Interfaces\FormInterface;
use SleepingOwl\Admin\Repository\BaseRepository;
use URL;
use Validator;

class FormDefault implements Renderable, DisplayInterface, FormInterface
{

	protected $class;
	protected $repository;
	protected $items = [];
	protected $action;
	protected $instance;
	protected $id;
	protected $initialized = false;

	public function setAction($action)
	{
		if (is_null($this->action))
		{
			$this->action = $action;
		}
	}

	public function setClass($class)
	{
		if (is_null($this->class))
		{
			$this->class = $class;
		}
	}

	public function initialize()
	{
		if ($this->initialized) return;

		$this->initialized = true;
		$this->repository = new BaseRepository($this->class);
		$this->instance(app($this->class));
		foreach ($this->items() as $item)
		{
			$item->initialize();
		}
	}

	public function items($items = null)
	{
		if (is_null($items))
		{
			return $this->items;
		}
		$this->items = $items;
		return $this;
	}

	public function instance($instance = null)
	{
		if (is_null($instance))
		{
			return $this->instance;
		}
		$this->instance = $instance;
		foreach ($this->items() as $item)
		{
			$item->setInstance($instance);
		}
		return $this;
	}

	public function setId($id)
	{
		if (is_null($this->id))
		{
			$this->id = $id;
			$this->instance($this->repository->find($id));
		}
	}

	public function model()
	{
		return Admin::model($this->class);
	}

	public function save()
	{
		foreach ($this->items() as $item)
		{
			$item->save();
		}
		$this->instance()->save();
	}

	public function validate($model)
	{
		if ($this->model() != $model)
		{
			return null;
		}

		$rules = [];
		foreach ($this->items() as $item)
		{
			$rules += $item->getValidationRules();
		}
		$data = Input::all();
		$validator = Validator::make($data, $rules);
		if ($validator->fails())
		{
			return $validator;
		}
		return null;
	}

	public function render()
	{
		$params = [
			'items'    => $this->items(),
			'instance' => $this->instance(),
			'action'   => $this->action,
			'backUrl'  => $this->model()->displayUrl(),
		];
		return view(AdminTemplate::view('form.default'), $params);
	}

	function __toString()
	{
		return (string)$this->render();
	}
}