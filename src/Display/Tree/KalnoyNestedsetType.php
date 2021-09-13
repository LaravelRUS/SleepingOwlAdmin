<?php

namespace SleepingOwl\Admin\Display\Tree;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * @see https://github.com/lazychaser/laravel-nestedset.
 */
class KalnoyNestedsetType extends NestedsetType
{
    /**
     * Get tree structure.
     *
     * @param  \Illuminate\Database\Eloquent\Collection  $collection
     * @return mixed
     */
    public function getTree(Collection $collection)
    {
        return $collection->toTree();
    }

    /**
     * @param  Model  $model
     * @return mixed
     */
    public function getLeftColumn(Model $model)
    {
        return $model->getLftName();
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return mixed
     */
    public function getRightColumn(Model $model)
    {
        return $model->getRgtName();
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return mixed
     */
    public function getParentColumn(Model $model)
    {
        return $model->getParentIdName();
    }
}
