<?php

namespace SleepingOwl\Admin\Display\Tree;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * @see https://github.com/etrepat/baum
 */
class BaumNodeType extends NestedsetType
{
    /**
     * Get tree structure.
     *
     * @param  \Illuminate\Database\Eloquent\Collection  $collection
     * @return mixed
     */
    public function getTree(Collection $collection)
    {
        return $collection->toHierarchy();
    }

    /**
     * @param  Model  $model
     * @return mixed
     */
    public function getLeftColumn(Model $model)
    {
        return $model->getLeftColumnName();
    }

    /**
     * @param  Model  $model
     * @return mixed
     */
    public function getRightColumn(Model $model)
    {
        return $model->getRightColumnName();
    }

    /**
     * @param  Model  $model
     * @return mixed
     */
    public function getParentColumn(Model $model)
    {
        return $model->getParentColumnName();
    }
}
