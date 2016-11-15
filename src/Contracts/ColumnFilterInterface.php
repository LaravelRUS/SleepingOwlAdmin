<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Database\Eloquent\Builder;

interface ColumnFilterInterface extends Initializable
{
    /**
     * @param mixed $value
     *
     * @return mixed
     */
    public function parseValue($value);

    /**
     * @param RepositoryInterface  $repository
     * @param NamedColumnInterface $column
     * @param Builder              $query
     * @param string               $search
     * @param array|string         $fullSearch
     *
     * @return void
     */
    public function apply(
        RepositoryInterface $repository,
        NamedColumnInterface $column,
        Builder $query,
        $search,
        $fullSearch
    );
}
