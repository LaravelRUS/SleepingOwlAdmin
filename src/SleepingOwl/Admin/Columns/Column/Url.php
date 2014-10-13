<?php namespace SleepingOwl\Admin\Columns\Column;

use Lang;

class Url extends BaseColumn
{
	/**
	 * @param string $name
	 * @param string $label
	 */
	function __construct($name, $label = null)
	{
		$this->hidden = true;
		parent::__construct($name, $label);
	}

	/**
	 * @param $instance
	 * @param int $totalCount
	 * @return string
	 */
	public function render($instance, $totalCount)
	{
		$url = $this->valueFromInstance($instance, $this->name);
		$content = $this->htmlBuilder->tag('i', [
			'class'       => 'fa fa-arrow-circle-o-right',
			'data-toggle' => 'tooltip',
			'title'       => Lang::get('admin::lang.table.filter-goto')
		]);
		return $this->htmlBuilder->tag('a', [
			'href'   => $url,
			'target' => '_blank'
		], $content);
	}
}