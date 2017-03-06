<?php

namespace SleepingOwl\Admin\Display\Tree;

use Illuminate\Database\Eloquent\Model;

/**
 * @see https://github.com/etrepat/baum
 */
class BaumNodeType extends NestedsetType
{
    /**
     * Get tree structure.
     *
     * @param \Illuminate\Database\Eloquent\Collection $collection
     *
     * @return mixed
     */
    public function getTree(\Illuminate\Database\Eloquent\Collection $collection)
    {
        return $collection->toHierarchy();
    }

    /**
     * @param Model $model
     *
     * @return string
     */
    public function getLeftColumn(Model $model)
    {
        return $model->getLeftColumnName();
    }

    /**
     * @param Model $model
     *
     * @return string
     */
    public function getRightColumn(Model $model)
    {
        return $model->getRightColumnName();
    }

    /**
     * @param Model $model
     *
     * @return string
     */
    public function getParentColumn(Model $model)
    {
        return $model->getParentColumnName();
    }
}