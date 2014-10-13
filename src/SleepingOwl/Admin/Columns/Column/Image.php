<?php namespace SleepingOwl\Admin\Columns\Column;

use SleepingOwl\Models\Interfaces\ModelWithImageFieldsInterface;

class Image extends BaseColumn
{

	function __construct($name, $label = null)
	{
		if (is_null($label))
		{
			$label = '';
		}
		parent::__construct($name, $label);
	}

	/**
	 * @param $instance
	 * @param int $totalCount
	 * @return string
	 */
	public function render($instance, $totalCount)
	{
		return parent::render($instance, $totalCount, $this->getCellContent($instance));
	}

	/**
	 * @param ModelWithImageFieldsInterface $instance
	 * @return string
	 */
	private function getCellContent(ModelWithImageFieldsInterface $instance)
	{
		$name = $this->name;
		if ( ! $instance->$name->exists()) return '';
		$img = $this->htmlBuilder->tag('img', [
			'class'       => 'thumbnail',
			'src'         => $instance->$name->thumbnail('admin_preview'),
			'width'       => '80px',
			'data-toggle' => 'tooltip',
			'title'       => $instance->$name->info()
		]);
		return $this->htmlBuilder->tag('a', [
			'href'        => $instance->$name->thumbnail('original'),
			'data-toggle' => 'lightbox'
		], $img);
	}

	public function isSortable()
	{
		return false;
	}
}