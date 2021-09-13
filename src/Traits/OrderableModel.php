<?php

namespace SleepingOwl\Admin\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Trait OrderableModel.
 *
 * @method static $this orderModel()
 * @method Builder findByPosition($position)
 */
trait OrderableModel
{
    /**
     * Boot trait.
     */
    protected static function bootOrderableModel()
    {
        static::creating(function (Model $row) {
            $row->updateOrderFieldOnCreate();
        });

        static::deleted(function (Model $row) {
            $row->updateOrderFieldOnDelete();
        });

        if (in_array("Illuminate\Database\Eloquent\SoftDeletes", trait_uses_recursive(new static()))) {
            static::restoring(function (Model $row) {
                $row->updateOrderFieldOnRestore();
            });
        }
    }

    /**
     * Get order value.
     *
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
        if ($previousRow = static::orderModel()->findByPosition($this->getOrderValue() - $destination)->first()) {
            $previousRow->{$this->getOrderField()} += $destination;
            $previousRow->save();
        }

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
        static::orderModel()
            ->where($this->getOrderField(), '>', $this->getOrderValue())
            ->decrement($this->getOrderField());
    }

    /**
     * Update order field on restore.
     */
    protected function updateOrderFieldOnRestore()
    {
        static::orderModel()
            ->where($this->getOrderField(), '>', $this->getOrderValue())
            ->increment($this->getOrderField());
    }

    /**
     * Order scope.
     *
     * @param $query
     * @return mixed
     */
    public function scopeOrderModel($query)
    {
        $parentFields = $this->getParentFieldName();
        if ($parentFields) {
            $parentFields = (array) $parentFields;
            foreach ($parentFields as $parentFieldName) {
                $query->where($parentFieldName, $this->{$parentFieldName});
            }
        }

        return $query->orderBy($this->getOrderField(), 'ASC');
    }

    /**
     * @param  Builder  $query
     * @param  int  $position
     * @return mixed
     */
    public function scopeFindByPosition(Builder $query, $position)
    {
        $query->where($this->getOrderField(), $position);
    }

    /**
     * Get order field name.
     *
     * @return string
     */
    public function getOrderField()
    {
        return $this->orderField ?: 'order';
    }

    /**
     * Get parent order field name.
     *
     * @return string
     */
    public function getParentFieldName()
    {
        return $this->parentFieldName ?: null;
    }
}
