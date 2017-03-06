<?php

namespace SleepingOwl\Admin\Display\Tree;

use SleepingOwl\Admin\Contracts\Display\Tree\TreeTypeInterface;
use SleepingOwl\Admin\Contracts\Repositories\TreeRepositoryInterface;

class SimpleTreeType implements TreeTypeInterface
{

    /**
     * @var TreeRepositoryInterface
     */
    private $repository;

    /**
     * @param TreeRepositoryInterface $repository
     */
    public function __construct(TreeRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Get tree structure.
     *
     * @param \Illuminate\Database\Eloquent\Collection $collection
     *
     * @return mixed
     */
    public function getTree(\Illuminate\Database\Eloquent\Collection $collection)
    {
        $collection = $this->repository
            ->getQuery()
            ->orderBy($this->repository->getParentField(), 'asc')
            ->orderBy($this->repository->getOrderField(), 'asc')
            ->get();

        return $this->repository->getChildren(
            $collection,
            $this->repository->getRootParentId()
        );
    }

    /**
     * Reorder tree by $data value.
     *
     * @param $data
     */
    public function reorder(array $data)
    {
        $this->recursiveReorder(
            $data,
            $this->repository->getRootParentId()
        );
    }

    /**
     * @param array $data
     * @param int $parentId
     */
    protected function recursiveReorder(array $data, $parentId)
    {
        foreach ($data as $order => $item) {
            $id = $item['id'];

            $instance = $this->repository->find($id);
            $instance->{$this->repository->getParentField()} = $parentId;
            $instance->{$this->repository->getOrderField()} = $order;
            $instance->save();

            if (isset($item['children'])) {
                $this->reorder($item['children'], $id);
            }
        }
    }
}