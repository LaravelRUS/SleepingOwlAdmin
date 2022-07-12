<?php

namespace SleepingOwl\Admin\Contracts\Repositories;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\WithModelInterface;
use SleepingOwl\Admin\Exceptions\RepositoryException;

interface RepositoryInterface extends WithModelInterface
{
    /**
     * @return string
     */
    public function getClass(): string;

    /**
     * @param string $class
     * @return $this
     *
     * @throws RepositoryException
     */
    public function setClass(string $class): RepositoryInterface;

    /**
     * @return string[]
     */
    public function getWith(): array;

    /**
     * @param string[] $with
     * @return $this
     */
    public function with(array $with): RepositoryInterface;

    /**
     * Get base query.
     *
     * @return Builder
     */
    public function getQuery(): Builder;

    /**
     * Find model instance by id.
     *
     * @param int $id
     * @return Model|null
     */
    public function find(int $id): ?Model;

    /**
     * Find model instance by id.
     *
     * @param int $id
     * @return Model|null
     */
    public function findOnlyTrashed(int $id): ?Model;

    /**
     * Find model instances by ids.
     *
     * @param  int[]  $ids
     * @return Collection
     */
    public function findMany(array $ids): Collection;

    /**
     * Delete model instance by id.
     *
     * @param int $id
     * @return void
     */
    public function delete(int $id);

    /**
     * Permanently delete model instance by id.
     *
     * @param int $id
     * @return void
     */
    public function forceDelete(int $id);

    /**
     * Restore model instance by id.
     *
     * @param int $id
     * @return void
     */
    public function restore(int $id);

    /**
     * @return bool
     */
    public function isRestorable(): bool;
}
