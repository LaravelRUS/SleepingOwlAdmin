<?php

namespace SleepingOwl\Admin\Contracts\Display\Tree;

interface TreeTypeInterface
{
    /**
     * Get tree structure.
     *
     * @param \Illuminate\Database\Eloquent\Collection $collection
     *
     * @return mixed
     */
    public function getTree(\Illuminate\Database\Eloquent\Collection $collection);

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
