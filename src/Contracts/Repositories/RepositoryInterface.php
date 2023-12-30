<?php

namespace SleepingOwl\Admin\Contracts\Repositories;

use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\WithModelInterface;
use SleepingOwl\Admin\Exceptions\RepositoryException;

interface RepositoryInterface extends WithModelInterface
{
    /**
     * @return string
     */
    public function getClass();

    /**
     * @param  string  $class
     * @return $this
     *
     * @throws RepositoryException
     */
    public function setClass($class);

    /**
     * @return \string[]
     */
    public function getWith();

    /**
     * @param  string[]  $with
     * @return $this
     */
    public function with($with);

    /**
     * Get base query.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function getQuery();

    /**
     * Find model instance by id.
     *
     * @param  int  $id
     * @return Model|null
     */
    public function find($id);

    /**
     * Find model instance by id.
     *
     * @param  int  $id
     * @return Model|null
     */
    public function findOnlyTrashed($id);

    /**
     * Find model instances by ids.
     *
     * @param  int[]  $ids
     * @return \Illuminate\Support\Collection
     */
    public function findMany(array $ids);

    /**
     * Delete model instance by id.
     *
     * @param  int  $id
     * @return void
     */
    public function delete($id);

    /**
     * Permanently delete model instance by id.
     *
     * @param  int  $id
     * @return void
     */
    public function forceDelete($id);

    /**
     * Restore model instance by id.
     *
     * @param  int  $id
     * @return void
     */
    public function restore($id);

    /**
     * @return bool
     */
    public function isRestorable();
}
