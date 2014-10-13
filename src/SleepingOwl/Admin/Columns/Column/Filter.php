<?php namespace SleepingOwl\Admin\Columns\Column;

use SleepingOwl\Admin\Admin;
use Lang;

class Filter extends BaseColumn
{
	/**
	 * @var \SleepingOwl\Admin\Router
	 */
	protected $router;
	/**
	 * Attribute name to get filter value from
	 * @var string
	 */
	protected $value;
	/**
	 * Model classname to filter in, if omitted uses model from assigned model item
	 * @var string
	 */
	protected $model;

	/**
	 * @param string $name
	 * @param string $label
	 */
	function __construct($name, $label = null)
	{
		$this->hidden = true;
		$this->router = Admin::instance()->router;
		parent::__construct($name, $label);
		$this->model($this->modelItem->getModelClass());
		$this->value('id');
	}

	/**
	 * @param $value
	 * @return $this
	 */
	public function value($value)
	{
		$this->value = $value;
		return $this;
	}

	/**
	 * @param $model
	 * @return $this
	 */
	public function model($model)
	{
		$this->model = $model;
		return $this;
	}

	/**
	 * @param $instance
	 * @param int $totalCount
	 * @return string
	 * @throws \SleepingOwl\Admin\Exceptions\ModelNotFoundException
	 */
	public function render($instance, $totalCount)
	{
		$filterValue = $this->valueFromInstance($instance, $this->value);
		$modelItem = Admin::instance()->models->modelWithClassname($this->model);
		$url = $this->router->routeToModel($modelItem->getAlias(), [$this->name => $filterValue]);
		if ($this->model === $this->modelItem->getModelClass())
		{
			$class = 'fa-filter';
			$title = Lang::get('admin::lang.table.filter');
		} else
		{
			$class = 'fa-arrow-circle-o-right';
			$title = Lang::get('admin::lang.table.filter-goto');
		}
		$content = $this->htmlBuilder->tag('i', [
			'class'       => [
				'fa',
				$class
			],
			'data-toggle' => 'tooltip',
			'title'       => $title
		]);
		return $this->htmlBuilder->tag('a', ['href' => $url], $content);
	}

} 