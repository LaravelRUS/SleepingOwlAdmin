<?php

namespace SleepingOwl\Admin\Contracts\Repositories;

use Illuminate\Database\Eloquent\Collection;

interface TreeRepositoryInterface extends RepositoryInterface
{
    /**
     * Get tree structure.
     *
     * @param  \Illuminate\Database\Eloquent\Collection  $collection
     * @return mixed
     */
    public function getTree(Collection $collection);

    /**
     * Get parent field name.
     *
     * @return string
     */
    public function getParentField();

    /**
     * @param  string  $parentField
     * @return $this
     */
    public function setParentField($parentField);

    /**
     * Get order field name.
     *
     * @return string
     */
    public function getOrderField();

    /**
     * @param  string  $orderField
     * @return $this
     */
    public function setOrderField($orderField);

    /**
     * Get or set parent field name.
     *
     * @return string
     */
    public function getRootParentId();

    /**
     * @param  string  $rootParentId
     * @return $this
     */
    public function setRootParentId($rootParentId);

    /**
     * Reorder tree by $data value.
     *
     * @param $data
     */
    public function reorder(array $data);
}
