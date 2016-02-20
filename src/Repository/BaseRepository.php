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
    public function setWith($with)
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
        return $this->getModel()->find($id);
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
        $query = $this->getModel()->query();
        if (method_exists($this->getModel(), 'withTrashed')) {
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
        $this->query()->onlyTrashed()->find($id)->restore();
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
}
