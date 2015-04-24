<?php namespace SleepingOwl\Admin\Display;

use AdminTemplate;
use Illuminate\Contracts\Support\Renderable;
use Input;
use Route;
use SleepingOwl\Admin\Admin;
use SleepingOwl\Admin\AssetManager\AssetManager;
use SleepingOwl\Admin\Columns\Column;
use SleepingOwl\Admin\Interfaces\DisplayInterface;
use SleepingOwl\Admin\Interfaces\WithRoutesInterface;
use SleepingOwl\Admin\Repository\TreeRepository;

class DisplayTree implements Renderable, DisplayInterface, WithRoutesInterface
{

	protected $class;
	protected $with = [];
	protected $repository;
	protected $reorderable = true;
	protected $parameters = [];
	protected $value = 'title';

	public function setClass($class)
	{
		if (is_null($this->class))
		{
			$this->class = $class;
		}
	}

	public function with($with = null)
	{
		if (is_null($with))
		{
			return $this->with;
		}
		if ( ! is_array($with))
		{
			$with = func_get_args();
		}
		$this->with = $with;
		return $this;
	}

	public function initialize()
	{
		AssetManager::addScript('admin::default/js/jquery.nestable.js');
		AssetManager::addScript('admin::default/js/nestable.js');
		AssetManager::addStyle('admin::default/css/jquery.nestable.css');

		$this->repository = new TreeRepository($this->class);
		$this->repository->with($this->with());

		Column::treeControl()->initialize();
	}

	public function reorderable($reorderable = null)
	{
		if (is_null($reorderable))
		{
			return $this->reorderable;
		}
		$this->reorderable = $reorderable;
		return $this;
	}

	public function repository()
	{
		return $this->repository;
	}

	public function parameters($parameters = null)
	{
		if (is_null($parameters))
		{
			return $this->parameters;
		}
		$this->parameters = $parameters;
		return $this;
	}

	public function model()
	{
		return Admin::model($this->class);
	}

	public function render()
	{
		$params = [
			'items'       => $this->repository->tree(),
			'reorderable' => $this->reorderable(),
			'url'         => Admin::model($this->class)->displayUrl(),
			'value'       => $this->value(),
			'creatable'   => ! is_null($this->model()->create()),
			'createUrl'   => $this->model()->createUrl($this->parameters() + Input::all()),
			'controls'    => [Column::treeControl()],
		];
		return view(AdminTemplate::view('display.tree'), $params);
	}

	function __toString()
	{
		return (string)$this->render();
	}

	public static function registerRoutes()
	{
		Route::post('{adminModel}/reorder', function ($model)
		{
			$data = Input::get('data');
			$model->display()->repository()->reorder($data);
		});
	}

	public function value($value = null)
	{
		if (is_null($value))
		{
			return $this->value;
		}
		$this->value = $value;
		return $this;
	}

}