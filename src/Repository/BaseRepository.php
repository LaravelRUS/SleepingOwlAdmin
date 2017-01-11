<?php

namespace SleepingOwl\Admin\Repository;

use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Exceptions\RepositoryException;

class BaseRepository implements RepositoryInterface
{
    /**
     * Repository related class name.
     * @var string
     */
    protected $class;

    /**
     * Repository related model instance.
     * @var Model
     */
    protected $model;

    /**
     * Eager loading relations.
     * @var string[]
     */
    protected $with = [];

    /**
     * @param string|Model $class
     *
     * @throws RepositoryException
     */
    public function __construct($class)
    {
        if ($class instanceof Model) {
            $this->setModel($class);
        } else {
            $this->setClass($class);
        }
    }

    /**
     * @return string
     */
    public function getClass()
    {
        return $this->class;
    }

    /**
     * @param string $class
     *
     * @return $this
     * @throws RepositoryException
     */
    public function setClass($class)
    {
        if (! class_exists($class)) {
            throw new RepositoryException("Class {$class} not found.");
        }

        $this->setModel(
            new $class()
        );

        return $this;
    }

    /**
     * @return Model
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * @param Model $model
     *
     * @return $this
     */
    public function setModel(Model $model)
    {
        $this->model = $model;
        $this->class = get_class($model);

        return $this;
    }

    /**
     * @return string[]
     */
    public function getWith()
    {
        return $this->with;
    }

    /**
     * @param string[] $with
     *
     * @return $this
     */
    public function with($with)
    {
        if (! is_array($with)) {
            $with = func_get_args();
        }

        $this->with = $with;

        return $this;
    }

    /**
     * Get base query.
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function getQuery()
    {
        return $this->getModel()
            ->query()
            ->with(
                $this->getWith()
            );
    }

    /**
     * Find model instance by id.
     *
     * @param int $id
     *
     * @return mixed
     */
    public function find($id)
    {
        $query = $this->getQuery();
        if ($this->isRestorable()) {
            $query->withTrashed();
        }

        return $query->find($id);
    }

    /**
     * Find model instance by id.
     *
     * @param int $id
     *
     * @return mixed
     */
    public function findOnlyTrashed($id)
    {
        return $this->getQuery()->onlyTrashed()->find($id);
    }

    /**
     * Find model instances by ids.
     *
     * @param int[] $ids
     *
     * @return \Illuminate\Support\Collection
     */
    public function findMany(array $ids)
    {
        $query = $this->getQuery();
        if ($this->isRestorable()) {
            $query->withTrashed();
        }

        return $query->whereIn($this->getModel()->getKeyName(), $ids)->get();
    }

    /**
     * Delete model instance by id.
     *
     * @param int $id
     */
    public function delete($id)
    {
        $this->find($id)->delete();
    }

    /**
     * Permanently delete model instance by id.
     *
     * @param int $id
     */
    public function forceDelete($id)
    {
        $this->findOnlyTrashed($id)->forceDelete();
    }

    /**
     * Restore model instance by id.
     *
     * @param int $id
     */
    public function restore($id)
    {
        $this->findOnlyTrashed($id)->restore();
    }

    /**
     * @return bool
     */
    public function isRestorable()
    {
        return in_array(\Illuminate\Database\Eloquent\SoftDeletes::class, class_uses_recursive($this->getClass()));
    }
}
