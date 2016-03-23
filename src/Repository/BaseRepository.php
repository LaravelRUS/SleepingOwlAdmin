<?php

namespace SleepingOwl\Admin\Repository;

use Cache;
use Schema;
use Illuminate\Database\Eloquent\Model;
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
     * Eager loading relations.
     * @var string[]
     */
    protected $with = [];

    /**
     * @param string $class
     */
    public function __construct($class)
    {
        if ($class instanceof Model) {
            $this->class = get_class($class);
            $model = $class;
        } else {
            $this->class = $class;
            $model = app($this->class);
        }

        $this->setModel($model);
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
     * @return mixed
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
        $columns = Cache::remember('admin.columns.'.$table, 60, function () use ($table) {
            return Schema::getColumnListing($table);
        });

        return array_search($column, $columns) !== false;
    }

    /**
     * @return bool
     */
    public function isRestorable()
    {
        return in_array(\Illuminate\Database\Eloquent\SoftDeletes::class, class_uses_recursive($this->class));
    }
}
