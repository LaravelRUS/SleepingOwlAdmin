<?php namespace SleepingOwl\Models\Traits;

use DB;

trait ModelWithOrderFieldTrait
{
	protected static function bootModelWithOrderFieldTrait()
	{
		static::creating(function ($row)
		{
			$row->updateSortFieldOnCreate();
		});

		static::deleted(function ($row)
		{
			$row->updateSortFieldOnDelete();
		});
	}

	public function getOrderValue()
	{
		return $this->{$this->getSortField()};
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
		$previousRow = static::sortModel()->where($this->getSortField(), $this->{$this->getSortField()} - $destination)->first();
		$previousRow->{$this->getSortField()} += $destination;
		$previousRow->save();

		$this->{$this->getSortField()} -= $destination;
		$this->save();
	}

	protected function updateSortFieldOnCreate()
	{
		$this->{$this->getSortField()} = static::sortModel()->count();
	}

	protected function updateSortFieldOnDelete()
	{
		static::sortModel()->where($this->getSortField(), '>', $this->{$this->getSortField()})->update([$this->getSortField() => DB::raw($this->getSortField() . ' - 1')]);
	}

	public function scopeSortModel($query)
	{
		return $query;
	}

	public function scopeDefaultSort($query)
	{
		return $query->orderBy($this->getSortField(), 'asc');
	}

	/**
	 * @return string
	 */
	public function getSortField()
	{
		return 'sort';
	}
}