<?php namespace SleepingOwl\Admin\Columns\Column;

use SleepingOwl\Admin\Admin;
use SleepingOwl\Html\FormBuilder;
use Lang;
use SleepingOwl\Models\Interfaces\ModelWithOrderFieldInterface;

class Control extends BaseColumn
{
	/**
	 * @var \SleepingOwl\Admin\Router
	 */
	protected $router;
	/**
	 * @var FormBuilder
	 */
	protected $formBuilder;

	/**
	 *
	 */
	function __construct()
	{
		parent::__construct('control-column', '');
		$admin = Admin::instance();
		$this->router = $admin->router;
		$this->formBuilder = $admin->formBuilder;
	}

	/**
	 * @param $instance
	 * @param int $totalCount
	 * @return string
	 */
	public function render($instance, $totalCount)
	{
		$buttons = [];
		if ( ! $this->modelItem->isOrderable())
		{
			$buttons[] = $this->moveButtons($instance, $totalCount);
		}
		$buttons[] = $this->editButton($instance, $this->modelItem->isEditable($instance));
		$buttons[] = $this->destroyButton($instance, $this->modelItem->isDeletable($instance));
		return $this->htmlBuilder->tag('td', ['class' => 'text-right'], implode(' ', $buttons));
	}

	/**
	 * @param $instance
	 * @param bool $active
	 * @return string
	 */
	protected function editButton($instance, $active = true)
	{
		$editParameters = [
			'class'       => 'btn btn-default btn-sm',
			'href'        => $this->router->routeToEdit($this->modelItem->getAlias(), $instance->getKey()),
			'data-toggle' => 'tooltip',
			'title'       => Lang::get('admin::lang.table.edit')
		];
		if ( ! $active)
		{
			$editParameters[] = 'disabled';
		}
		return $this->htmlBuilder->tag('a', $editParameters, '<i class="fa fa-pencil"></i>');
	}

	/**
	 * @param $instance
	 * @param bool $active
	 * @return string
	 */
	protected function destroyButton($instance, $active = true)
	{
		$content = '';
		$content .= $this->formBuilder->open([
			'method' => 'delete',
			'url'    => $this->router->routeToDestroy($this->modelItem->getAlias(), $instance->getKey()),
			'class'  => 'inline-block'
		]);
		$attributes = [
			'class'       => 'btn btn-danger btn-sm btn-delete',
			'type'        => 'submit',
			'data-toggle' => 'tooltip',
			'title'       => Lang::get('admin::lang.table.delete'),
		];
		if ( ! $active)
		{
			$attributes[] = 'disabled';
		}
		$content .= $this->htmlBuilder->tag('button', $attributes, '<i class="fa fa-times"></i>');
		$content .= $this->formBuilder->close();
		return $content;
	}

	/**
	 * @param ModelWithOrderFieldInterface $instance
	 * @param $totalCount
	 * @return string
	 */
	protected function moveButtons(ModelWithOrderFieldInterface $instance, $totalCount)
	{
		$sort = $instance->getOrderValue();
		$buttons = [];
		if ($sort > 0)
		{
			$buttons[] = $this->moveButton($this->router->routeToMoveup($this->modelItem->getAlias(), $instance->getKey()), Lang::get('admin::lang.table.moveUp'), '&uarr;');
		}
		if ($sort < $totalCount - 1)
		{
			$buttons[] = $this->moveButton($this->router->routeToMovedown($this->modelItem->getAlias(), $instance->getKey()), Lang::get('admin::lang.table.moveDown'), '&darr;');
		}
		return implode(' ', $buttons);
	}

	/**
	 * @param $route
	 * @param $title
	 * @param $label
	 * @return string
	 */
	protected function moveButton($route, $title, $label)
	{
		$content = '';
		$content .= $this->formBuilder->open([
			'method' => 'patch',
			'url'    => $route,
			'class'  => 'inline-block'
		]);
		$content .= $this->htmlBuilder->tag('button', [
			'class'       => 'btn btn-default btn-sm',
			'type'        => 'submit',
			'data-toggle' => 'tooltip',
			'title'       => $title
		], $label);
		$content .= $this->formBuilder->close();
		return $content;
	}
} 