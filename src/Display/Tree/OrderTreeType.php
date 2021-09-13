<?php

namespace SleepingOwl\Admin\Display\Tree;

use Illuminate\Database\Eloquent\Collection;
use SleepingOwl\Admin\Contracts\Display\Tree\TreeTypeInterface;
use SleepingOwl\Admin\Contracts\Repositories\TreeRepositoryInterface;

class OrderTreeType implements TreeTypeInterface
{
    /**
     * @var TreeRepositoryInterface
     */
    protected $repository;

    /**
     * @return TreeRepositoryInterface
     */
    public function getRepository()
    {
        return $this->repository;
    }

    /**
     * @param  TreeRepositoryInterface  $repository
     */
    public function __construct(TreeRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Get tree structure.
     *
     * @param  \Illuminate\Database\Eloquent\Collection  $collection
     * @return mixed
     */
    public function getTree(Collection $collection)
    {
        $collection = $collection->sortBy($this->repository->getOrderField());

        return $collection;
    }

    /**
     * Reorder tree by $data value.
     *
     * @param $data
     */
    public function reorder(array $data)
    {
        $this->recursiveReorder(
            $data
        );
    }

    /**
     * @param  array  $data
     */
    protected function recursiveReorder(array $data)
    {
        foreach ($data as $order => $item) {
            $id = $item['id'];

            $instance = $this->repository->find($id);
            $instance->{$this->repository->getOrderField()} = $order;
            $instance->save();
        }
    }
}
