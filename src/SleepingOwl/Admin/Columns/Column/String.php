<?php namespace SleepingOwl\Admin\Columns\Column;

class String extends BaseColumn
{
	/**
	 * @var string
	 */
	protected $orderBy;

	/**
	 * @param $orderBy
	 * @return $this
	 */
	public function orderBy($orderBy)
	{
		$this->orderBy = $orderBy;
		return $this;
	}

	/**
	 * @return string
	 */
	public function getOrderBy()
	{
		if ( ! is_null($this->orderBy))
		{
			return $this->orderBy;
		}
		return $this->name;
	}

	/**
	 * @param $instance
	 * @return array
	 */
	protected function getAttributesForCell($instance)
	{
		if ( ! is_null($this->orderBy))
		{
			return ['data-order' => $this->valueFromInstance($instance, $this->orderBy)];
		}
		return [];
	}

	public function isSortable()
	{
		$sortable = $this->sortable !== false;
		if ($this->modelItem->isWithJoinEnabled())
		{
			return $sortable;
		}
		return $sortable && strpos($this->name, '.') === false;
	}


}