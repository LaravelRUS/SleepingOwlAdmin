<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Illuminate\Database\Eloquent\Builder;



interface ColumnMetaInterface
{

    /**
     * @param NamedColumnInterface $column
     * @param Builder $query
     * @param $queryString
     * @return mixed
     */
    public function onSearch(NamedColumnInterface $column, Builder $query, $queryString);

    /**
     * @param NamedColumnInterface $column
     * @param Builder $query
     * @param string $queryString
     * @param array|string $queryParams
     *
     * @return void
     */
    public function onFilterSearch(NamedColumnInterface $column, Builder $query, $queryString, $queryParams);


    /**
     * @param NamedColumnInterface $column
     * @param Builder $query
     * @param string $direction
     * @return mixed
     */
    public function onOrderBy(NamedColumnInterface $column, Builder $query, $direction);
}
