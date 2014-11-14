<?php namespace SleepingOwl\Admin\Columns\Column;

class Count extends BaseColumn
{

	public function render($instance, $totalCount)
	{
		$content = count($this->valueFromInstance($instance, $this->name));
		return parent::render($instance, $totalCount, $content);
	}

	public function getRelation()
	{
		return $this->name;
	}

	public function isSortable()
	{
		return ! $this->modelItem->isAsync();
	}

} 