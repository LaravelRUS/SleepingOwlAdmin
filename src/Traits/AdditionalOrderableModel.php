<?php

namespace SleepingOwl\Admin\Traits;

use Illuminate\Database\Eloquent\Builder;

/**
 * Trait AdditionalOrderableModel.
 * @method static $this orderModel()
 * @method Builder findByPosition($position)
 */
trait AdditionalOrderableModel
{
    use OrderableModel;

    /**
     * REWRITE Order scope From ORDER Trait.
     *
     * @param Builder $query
     *
     * @return mixed
     */
    public function scopeOrderModel($query)
    {
        $parentFields = (array)$this->getParentFieldName();
        foreach ($parentFields as $parentFieldName) {
            $query->where($parentFieldName, $this->{$parentFieldName});
        }
        return $query->orderBy($this->getOrderField());
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
     * Get parent field name.
     *
     * @return string
     */
    public function getParentFieldName()
    {
        return $this->parentOrderField ?: 'parent_order';
    }
}