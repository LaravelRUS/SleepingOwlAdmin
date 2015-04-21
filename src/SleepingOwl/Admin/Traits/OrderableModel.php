<?php namespace SleepingOwl\Admin\Traits;

use DB;

trait OrderableModel
{
	protected static function bootOrderableModel()
	{
		static::creating(function ($row)
		{
			$row->updateOrderFieldOnCreate();
		});

		static::deleted(function ($row)
		{
			$row->updateOrderFieldOnDelete();
		});
	}

	public function getOrderValue()
	{
		return $this->{$this->getOrderField()};
	}

	public function moveUp()
	{
		$this->move(1);
	}

	public function moveDown()
	{
		$this->move(-1);
	}

	/**
	 * @param $destination -1 (move down) or 1 (move up)
	 */
	protected function move($destination)
	{
		$previousRow = static::orderModel()->where($this->getOrderField(), $this->getOrderValue() - $destination)->first();
		$previousRow->{$this->getOrderField()} += $destination;
		$previousRow->save();

		$this->{$this->getOrderField()} -= $destination;
		$this->save();
	}

	protected function updateOrderFieldOnCreate()
	{
		$this->{$this->getOrderField()} = static::orderModel()->count();
	}

	protected function updateOrderFieldOnDelete()
	{
		static::orderModel()->where($this->getOrderField(), '>', $this->getOrderValue())->update([$this->getOrderField() => DB::raw($this->getOrderField() . ' - 1')]);
	}

	public function scopeOrderModel($query)
	{
		return $query;
	}

	public function getOrderField()
	{
		return 'order';
	}

}