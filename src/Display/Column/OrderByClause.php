<?php

namespace SleepingOwl\Admin\Display\Column;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Mockery\Matcher\Closure;
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
     * @param  string|Closure  $name
     */
    public function __construct($name)
    {
        $this->setName($name);
    }

    /**
     * @param  Builder  $query
     * @param  string  $direction
     */
    public function modifyQuery(Builder $query, $direction = 'asc')
    {
        $this->name instanceof \Closure
            ? $this->callCallable($query, $direction)
            : $this->callDefaultClause($query, $direction);
    }

    /**
     * @param  string|\Closure  $name
     * @return \SleepingOwl\Admin\Display\Column\OrderByClause
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @param  Builder  $query
     * @param  string  $direction
     */
    protected function callCallable(Builder $query, $direction)
    {
        call_user_func_array($this->name, [$query, $direction]);
    }

    /**
     * @param  Builder  $query
     * @param  string  $direction
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
     *
     * @param  Builder  $query
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
                    $loadRelationMethod = implode('', ['load', class_basename(get_class($relationClass))]);

                    if ($relationClass instanceof MorphTo) {
                        /**
                         * @see loadMorphTo
                         */
                        $relationModel = null;
                    } else {
                        $relationModel = $relationClass->getRelated();
                    }
                    call_user_func([$this, $loadRelationMethod], $relations, $relationClass, $relationModel, $model, $query, $direction);
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
     *
     * @param  Collection  $relations
     * @param  HasOneOrMany  $relationClass
     * @param  Model  $relationModel
     * @param  Model  $model
     * @param  Builder  $query
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
     *
     * @param  Collection  $relations
     * @param  HasOneOrMany  $relationClass
     * @param  Model  $relationModel
     * @param  Model  $model
     * @param  Builder  $query
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
     *
     * @param  Collection  $relations
     * @param  HasOneOrMany  $relationClass
     * @param  Model  $relationModel
     * @param  Model  $model
     * @param  Builder  $query
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

        $sortedColumnRaw = $query->getConnection()->getQueryGrammar()->wrapTable($foreignTable).'.'.$query->getConnection()->getQueryGrammar()->wrap($relations->last());
        $sortedColumnAlias = implode('__', [$foreignTable, $relations->last()]);

        $this->sortedColumnAlias = $sortedColumnAlias;

        $query
            ->addSelect([DB::raw($sortedColumnRaw.' AS '.$sortedColumnAlias)])
            ->join($foreignTable, $foreignColumn, '=', $ownerColumn, 'left');
    }

    /**
     * Load keys for BelongsTo.
     *
     * @param  Collection  $relations
     * @param  BelongsTo  $relationClass
     * @param  Model  $relationModel
     * @param  Model  $model
     * @param  Builder  $query
     */
    protected function loadBelongsTo(
        Collection $relations,
        BelongsTo $relationClass,
        Model $relationModel,
        Model $model,
        Builder $query
    ) {
        if (version_compare(app()->version(), '5.8.0', 'gt')) {
            $foreignKey = $relationClass->getOwnerKeyName();
            $ownerKey = $relationClass->getForeignKeyName();
        } else {
            $foreignKey = $relationClass->getOwnerKey();
            $ownerKey = $relationClass->getForeignKey();
        }

        $ownerTable = $model->getTable();
        $foreignTable = $relationModel->getTable();

        $ownerColumn = implode('.', [$ownerTable, $ownerKey]);
        $foreignColumn = implode('.', [$foreignTable, $foreignKey]);

        $sortedColumnRaw = $query->getConnection()->getQueryGrammar()->wrapTable($foreignTable).'.'.$query->getConnection()->getQueryGrammar()->wrap($relations->last());
        $sortedColumnAlias = implode('__', [$foreignTable, $relations->last()]);

        $this->sortedColumnAlias = $sortedColumnAlias;

        $query
            ->addSelect([DB::raw($sortedColumnRaw.' AS '.$sortedColumnAlias)])
            ->join($foreignTable, $foreignColumn, '=', $ownerColumn, 'left');
    }

    /**
     * Load keys for MorphTo.
     *
     * @param  Collection  $relations
     * @param  MorphTo  $relationClass
     * @param  null  $relationModel
     * @param  Model  $model
     * @param  Builder  $query
     */
    protected function loadMorphTo(
        Collection $relations,
        MorphTo $relationClass,
        $relationModel,
        Model $model,
        Builder $query
    ) {
        if (version_compare(app()->version(), '5.8.0', 'gt')) {
            $foreignKey = $relationClass->getOwnerKeyName();
            $ownerKey = $relationClass->getForeignKeyName();
        } else {
            $foreignKey = $relationClass->getOwnerKey();
            $ownerKey = $relationClass->getForeignKey();
        }

        $foreignKey = $foreignKey ?? 'id';
        $ownerTable = $model->getTable();
        $ownerColumn = implode('.', [$ownerTable, $ownerKey]);
        $morphType = $relationClass->getMorphType();

        $foreignTablePrefix = 'morphTo'.mt_rand(99, 999);
        $foreignTableField = $relations->last();
        $sortedColumnAlias = implode('__', [$foreignTablePrefix, $foreignTableField]);
        $this->sortedColumnAlias = $sortedColumnAlias;

        // Get all exists morph types from table
        $existsMorphTypes = (new $model())
            ->distinct()
            ->selectRaw($morphType)
            ->get()
            ->pluck($morphType)
            ->toArray();

        // Make morph map
        $morphMap = Relation::$morphMap;
        $existsMorphTypesTablesMap = [];
        foreach ($existsMorphTypes as $existsMorphType) {
            $existsMorphTypeAlias = $existsMorphType;
            $relatedModelClassName = @$morphMap[$existsMorphType] ?: $existsMorphType;
            $tableName = (new $relatedModelClassName())->getTable();
            $existsMorphTypesTablesMap[] = [
                'morph_type_alias' => $existsMorphTypeAlias,
                'morph_type'       => $existsMorphType,
                'table_name'       => $tableName,
            ];
        }

        // Join all related tables from morph map & generate SQL CASE-WHEN-THEN-END statement
        $sortedColumnRaw = [];
        foreach ($existsMorphTypesTablesMap as $array) {
            $existsMorphType = $array['morph_type'];
            $existsMorphTypeAlias = $array['morph_type_alias'];
            $tableName = $array['table_name'];
            $tableAlias = $foreignTablePrefix.'_'.$tableName;
            $sortedColumnRaw[] = "WHEN '$existsMorphType' THEN ".$query->getConnection()->getQueryGrammar()->wrapTable($tableAlias).'.'.$query->getConnection()->getQueryGrammar()->wrap($foreignTableField);

            $query->leftJoin(DB::raw($query->getConnection()->getQueryGrammar()->wrapTable($tableName).' AS '.$query->getConnection()->getQueryGrammar()->wrap($tableAlias)), function ($join) use ($tableAlias, $foreignKey, $ownerColumn, $ownerTable, $morphType, $existsMorphTypeAlias) {
                $join
                    ->on(DB::raw($join->getConnection()->getQueryGrammar()->wrapTable($tableAlias).'.'.$join->getConnection()->getQueryGrammar()->wrap($foreignKey)), '=', $ownerColumn)
                    ->where(DB::raw($join->getConnection()->getQueryGrammar()->wrapTable($ownerTable).'.'.$join->getConnection()->getQueryGrammar()->wrap($morphType)), '=', DB::raw($join->getConnection()->getQueryGrammar()->wrap($existsMorphTypeAlias)));
            });
        }
        $sortedColumnRaw = '(CASE '.$query->getConnection()->getQueryGrammar()->wrapTable($ownerTable).'.'.$query->getConnection()->getQueryGrammar()->wrap($morphType).' '.implode(' ', $sortedColumnRaw).' END)';

        // Add sorted field to result
        $query->addSelect([DB::raw($sortedColumnRaw.' AS '.$sortedColumnAlias)]);
    }
}
