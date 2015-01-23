<?php namespace SleepingOwl\Admin\Columns\Column;

class Lists extends BaseColumn
{

	/**
	 * @param $instance
	 * @param int $totalCount
	 * @return string
	 */
	public function render($instance, $totalCount)
	{
		$list = $this->valueFromInstance($instance, $this->name);
		$content = [];
		foreach ($list as $item)
		{
			$content[] = $this->htmlBuilder->tag('li', [], $item);
		}
		$content = $this->htmlBuilder->tag('ul', ['class' => 'list-unstyled'], implode('', $content));
		return parent::render($instance, $totalCount, $content);
	}

	public function isSortable()
	{
		return false;
	}

}