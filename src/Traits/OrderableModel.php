<?php

namespace SleepingOwl\Admin\Traits;

trait OrderableModel
{
    /**
     * Boot trait.
     */
    protected static function bootOrderableModel()
    {
        static::creating(function ($row) {
            $row->updateOrderFieldOnCreate();
        });

        static::deleted(function ($row) {
            $row->updateOrderFieldOnDelete();
        });
    }

    /**
     * Get order value.
     * @return int
     */
    public function getOrderValue()
    {
        return $this->{$this->getOrderField()};
    }

    /**
     * Move model up.
     */
    public function moveUp()
    {
        $this->move(1);
    }

    /**
     * Move model down.
     */
    public function moveDown()
    {
        $this->move(-1);
    }

    /**
     * Move model in the $destination.
     *
     * @param $destination -1 (move down) or 1 (move up)
     */
    protected function move($destination)
    {
        $previousRow = static::orderModel()
            ->where($this->getOrderField(), $this->getOrderValue() - $destination)
            ->first();

        $previousRow->{$this->getOrderField()} += $destination;
        $previousRow->save();

        $this->{$this->getOrderField()} -= $destination;
        $this->save();
    }

    /**
     * Update order field on create.
     */
    protected function updateOrderFieldOnCreate()
    {
        $this->{$this->getOrderField()} = static::orderModel()->count();
    }

    /**
     * Update order field on delete.
     */
    protected function updateOrderFieldOnDelete()
    {
        static::orderModel()->where(
            $this->getOrderField(), '>', $this->getOrderValue())->decrement($this->getOrderField()
        );
    }

    /**
     * Order scope.
     *
     * @param $query
     *
     * @return mixed
     */
    public function scopeOrderModel($query)
    {
        return $query;
    }

    /**
     * Get order field name.
     * @return string
     */
    public function getOrderField()
    {
        return 'order';
    }
}
