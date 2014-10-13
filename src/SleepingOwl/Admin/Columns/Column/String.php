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

}