<?php

namespace SleepingOwl\Admin\Repository;

use Illuminate\Contracts\Cache\Repository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Schema\Builder;
use SleepingOwl\Admin\Contracts\RepositoryInterface;

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
     * @var Repository
     */
    protected $cache;

    /**
     * @var Builder
     */
    protected $schema;

    /**
     * Eager loading relations.
     * @var string[]
     */
    protected $with = [];

    /**
     * @param Repository $cache
     * @param Builder $schema
     * @param string|Model $class
     */
    public function __construct(Repository $cache, Builder $schema, $class)
    {
        if ($class instanceof Model) {
            $this->class = get_class($class);
            $model = $class;
        } else {
            $this->class = $class;
            $model = new $class;
        }

        $this->setModel($model);

        $this->cache = $cache;
        $this->schema = $schema;
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
     */
    public function setModel(Model $model)
    {
        $this->model = $model;
    }

    /**
     * @return \string[]
     */
    public function getWith()
    {
        return $this->with;
    }

    /**
     * @param \string[] $with
     */
    public function with($with)
    {
        if (! is_array($with)) {
            $with = func_get_args();
        }

        $this->with = $with;
    }

    /**
     * Get base query.
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Query\Builder
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
     * @return mixed
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
     * Check if model's table has column.
     *
     * @param string $column
     *
     * @return bool
     */
    public function hasColumn($column)
    {
        $table = $this->getModel()->getTable();
        $columns = $this->cache->remember('admin.columns.'.$table, 60, function () use ($table) {
            return $this->schema->getColumnListing($table);
        });

        return array_search($column, $columns) !== false;
    }

    /**
     * @return bool
     */
    public function isRestorable()
    {
        return in_array(SoftDeletes::class, class_uses_recursive($this->class));
    }
}
