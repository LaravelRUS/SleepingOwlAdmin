<?php

namespace SleepingOwl\Admin\Display\Tree;

use Illuminate\Database\Eloquent\Collection;
use SleepingOwl\Admin\Contracts\Display\Tree\TreeTypeInterface;
use SleepingOwl\Admin\Contracts\Repositories\TreeRepositoryInterface;

class SimpleTreeType implements TreeTypeInterface
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
        $collection = $collection->sortBy($this->repository->getParentField())
            ->sortBy($this->repository->getOrderField());

        return $this->getChildren(
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
     * @param  array  $data
     * @param  int  $parentId
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
                $this->recursiveReorder($item['children'], $id);
            }
        }
    }

    /**
     * Get children for simple tree type structure.
     *
     * @param $collection
     * @param $id
     * @return Collection
     */
    protected function getChildren($collection, $id)
    {
        $parentField = $this->repository->getParentField();
        $result = [];
        foreach ($collection as $instance) {
            if ((int) $instance->$parentField != $id) {
                continue;
            }

            $instance->setRelation(
                'children',
                $this->getChildren($collection, $instance->getKey())
            );

            $result[] = $instance;
        }

        return new Collection($result);
    }
}
