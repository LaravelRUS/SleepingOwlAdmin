<?php

namespace SleepingOwl\Admin\Repositories;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\Repositories\RepositoryInterface;
use SleepingOwl\Admin\Exceptions\RepositoryException;

class BaseRepository implements RepositoryInterface
{
    /**
     * Repository related class name.
     *
     * @var string
     */
    protected string $class;

    /**
     * Repository related model instance.
     *
     * @var Model
     */
    protected Model $model;

    /**
     * Eager loading relations.
     *
     * @var string[]
     */
    protected $with = [];

    /**
     * @return string
     */
    public function getClass(): string
    {
        return $this->class;
    }

    /**
     * @param string $class
     * @return self
     *
     * @throws RepositoryException
     */
    public function setClass(string $class): self
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
    public function getModel(): Model

    {
        return $this->model;
    }

    /**
     * @param  Model  $model
     * @return $this
     */
    public function setModel(Model $model): self
    {
        $this->model = $model;
        $this->class = get_class($model);

        return $this;
    }

    /**
     * @return string[]
     */
    public function getWith(): array
    {
        return $this->with;
    }

    /**
     * @param string[] $with
     * @return $this
     */
    public function with(array $with): self
    {
        if (! is_array($with)) {
            $with = func_get_args();
        }

        $this->with = $with;

        return $this;
    }

    /**
     * Get base query.
     *
     * @return Builder
     */
    public function getQuery(): Builder
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
     * @return Model
     * @TODO $id не всегда только инт
     */
    public function find(int $id): Model
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
     * @return Model
     */
    public function findOnlyTrashed(int $id): Model
    {
        return $this->getQuery()->onlyTrashed()->find($id);
    }

    /**
     * Find model instances by ids.
     *
     * @param  int[]  $ids
     * @return Collection
     */
    public function findMany(array $ids): Collection
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
    public function delete(int $id)
    {
        $this->find($id)->delete();
    }

    /**
     * Permanently delete model instance by id.
     *
     * @param int $id
     */
    public function forceDelete(int $id)
    {
        $this->findOnlyTrashed($id)->forceDelete();
    }

    /**
     * Restore model instance by id.
     *
     * @param int $id
     */
    public function restore(int $id)
    {
        $this->findOnlyTrashed($id)->restore();
    }

    /**
     * @return bool
     */
    public function isRestorable(): bool
    {
        return in_array(SoftDeletes::class, class_uses_recursive($this->getClass()));
    }
}
