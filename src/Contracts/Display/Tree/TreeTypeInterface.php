<?php

namespace SleepingOwl\Admin\Contracts\Display\Tree;

use Illuminate\Database\Eloquent\Collection;

interface TreeTypeInterface
{
    /**
     * Get tree structure.
     *
     * @param  \Illuminate\Database\Eloquent\Collection  $collection
     * @return mixed
     */
    public function getTree(Collection $collection);

    /**
     * Reorder tree by $data value.
     *
     * @param $data
     */
    public function reorder(array $data);

    /**
     * Return repository.
     *
     * @return mixed
     */
    public function getRepository();
}
