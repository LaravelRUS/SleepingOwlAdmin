<?php

namespace SleepingOwl\Admin\Display\Column;

use DB;
use Illuminate\Support\Str;
use Mockery\Matcher\Closure;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;
use SleepingOwl\Admin\Contracts\Display\OrderByClauseInterface;

class OrderByClause implements OrderByClauseInterface
{
    /**
     * @var string|\Closure
     */
    protected $name;

    /**
     * @var string|null
     */
    protected $sortedColumnAlias = null;

    /**
     * OrderByClause constructor.
     *
     * @param string|Closure $name
     */
    public function __construct($name)
    {
        $this->setName($name);
    }

    /**
     * @param Builder $query
     * @param string $direction
     */
    public function modifyQuery(Builder $query, $direction = 'asc')
    {
        $this->name instanceof \Closure
            ? $this->callCallable($query, $direction)
            : $this->callDefaultClause($query, $direction);
    }

    /**
     * @param string|\Closure $name
     *
     * @return $this
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @param Builder $query
     * @param string $direction
     */
    protected function callCallable(Builder $query, $direction)
    {
        call_user_func_array($this->name, [$query, $direction]);
    }

    /**
     * @param Builder $query
     * @param string $direction
     */
    protected function callDefaultClause(Builder $query, $direction)
    {
        if ($this->isRelationName($this->name)) {
            $this->loadRelationOrder($query, $direction);
        } else {
            $query->orderBy($this->name, $direction);
        }
    }

    /**
     * @param $name
     * @return bool
     */
    protected function isRelationName($name)
    {
        return Str::contains($name, '.');
    }

    /**
     * Make EagerLoad.
     */
    protected function eagerLoad()
    {
    }

    /**
     * Load Relations by this->name.
     * @param Builder $query
     * @param $direction
     */
    protected function loadRelationOrder(Builder $query, $direction)
    {
        /** @var Relation $relationClass */
        $relations = collect(explode('.', $this->name));
        $loop = 0;
        if ($relations->count() >= 2) {
            $query->select($query->getModel()->getTable().'.*');

            do {
                $model = ! $loop++ ? $query->getModel() : $relationClass->getModel();
                $relation = $relations->shift();

                if (method_exists($model, $relation)) {
                    $relationClass = $model->{$relation}();
                    $relationModel = $relationClass->getRelated();

                    $loadRelationMethod = implode('', ['load', class_basename(get_class($relationClass))]);
                    call_user_func([$this, $loadRelationMethod],
                        $relations, $relationClass, $relationModel, $model, $query, $direction);
                } else {
                    break;
                }
            } while (true);

            if ($this->sortedColumnAlias) {
                $query->orderBy(DB::raw($this->sortedColumnAlias), $direction);
            }
        }
    }

    /**
     * Load HasOneOrMany keys.
     * @param Collection $relations
     * @param HasOneOrMany $relationClass
     * @param Model $relationModel
     * @param Model $model
     * @param Builder $query
     * @param $direction
     */
    protected function loadHasOne(
        Collection $relations,
        HasOneOrMany $relationClass,
        Model $relationModel,
        Model $model,
        Builder $query,
        $direction
    ) {
        $this->loadHasOneOrMany($relations, $relationClass, $relationModel, $model, $query, $direction);
    }

    /**
     * Load HasMany keys.
     * @param Collection $relations
     * @param HasOneOrMany $relationClass
     * @param Model $relationModel
     * @param Model $model
     * @param Builder $query
     * @param $direction
     */
    protected function loadHasMany(
        Collection $relations,
        HasOneOrMany $relationClass,
        Model $relationModel,
        Model $model,
        Builder $query,
        $direction
    ) {
        $this->loadHasOneOrMany($relations, $relationClass, $relationModel, $model, $query, $direction);
    }

    /**
     * Load HasOneOrMany keys.
     * @param Collection $relations
     * @param HasOneOrMany $relationClass
     * @param Model $relationModel
     * @param Model $model
     * @param Builder $query
     * @param $direction
     */
    protected function loadHasOneOrMany(
        Collection $relations,
        HasOneOrMany $relationClass,
        Model $relationModel,
        Model $model,
        Builder $query,
        $direction
    ) {
        $ownerTable = $model->getTable();
        $foreignTable = $relationModel->getTable();

        $ownerColumn = $relationClass->getQualifiedForeignKeyName();
        $foreignColumn = $relationClass->getQualifiedParentKeyName();
        $sortedColumnRaw = '`'.$foreignTable.'`.`'.$relations->last().'`';
        $sortedColumnAlias = implode('__', [$foreignTable, $relations->last()]);

        $this->sortedColumnAlias = $sortedColumnAlias;

        $query
            ->addSelect([DB::raw($sortedColumnRaw.' AS '.$sortedColumnAlias)])
            ->join($foreignTable, $foreignColumn, '=', $ownerColumn, 'left');
    }

    /**
     * Load keys for BelongsTo.
     * @param Collection $relations
     * @param BelongsTo $relationClass
     * @param Model $relationModel
     * @param Model $model
     * @param Builder $query
     * @param $direction
     */
    protected function loadBelongsTo(
        Collection $relations,
        BelongsTo $relationClass,
        Model $relationModel,
        Model $model,
        Builder $query,
        $direction
    ) {
        $foreignKey = $relationClass->getOwnerKeyName();
        $ownerKey = $relationClass->getForeignKeyName();

        $ownerTable = $model->getTable();
        $foreignTable = $relationModel->getTable();

        $ownerColumn = implode('.', [$ownerTable, $ownerKey]);
        $foreignColumn = implode('.', [$foreignTable, $foreignKey]);
        $sortedColumnRaw = '`'.$foreignTable.'`.`'.$relations->last().'`';
        $sortedColumnAlias = implode('__', [$foreignTable, $relations->last()]);

        $this->sortedColumnAlias = $sortedColumnAlias;

        $query
            ->addSelect([DB::raw($sortedColumnRaw.' AS '.$sortedColumnAlias)])
            ->join($foreignTable, $foreignColumn, '=', $ownerColumn, 'left');
    }
}
