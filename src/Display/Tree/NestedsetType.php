<?php

namespace SleepingOwl\Admin\Display\Tree;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use SleepingOwl\Admin\Contracts\Display\Tree\TreeTypeInterface;
use SleepingOwl\Admin\Contracts\Repositories\TreeRepositoryInterface;

abstract class NestedsetType implements TreeTypeInterface
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
     * Reorder tree by $data value.
     *
     * @param $data
     */
    public function reorder(array $data)
    {
        $left = 1;
        foreach ($data as $root) {
            $left = $this->recursiveReorder($root, null, $left);
        }
    }

    /**
     * Получение ключа поля LeftColumn.
     *
     * @param  Model  $model
     * @return mixed
     */
    abstract public function getLeftColumn(Model $model);

    /**
     * Получение ключа поля RightColumn.
     *
     * @param  Model  $model
     * @return mixed
     */
    abstract public function getRightColumn(Model $model);

    /**
     * Получение ключа поля Parent Column.
     *
     * @param  Model  $model
     * @return mixed
     */
    abstract public function getParentColumn(Model $model);

    /**
     * Recursive reorder nested-set tree type.
     *
     * @param $root
     * @param $parentId
     * @param $left
     * @return mixed
     */
    protected function recursiveReorder($root, $parentId, $left)
    {
        $right = $left + 1;
        $children = Arr::get($root, 'children', []);
        foreach ($children as $child) {
            $right = $this->recursiveReorder($child, $root['id'], $right);
        }
        $this->move($root['id'], $parentId, $left, $right);
        $left = $right + 1;

        return $left;
    }

    /**
     * Move tree node in nested-set tree type.
     *
     * @param $id
     * @param $parentId
     * @param $left
     * @param $right
     */
    protected function move($id, $parentId, $left, $right)
    {
        $instance = $this->repository->find($id);

        $attributes = $instance->getAttributes();
        $attributes[$this->getLeftColumn($instance)] = $left;
        $attributes[$this->getRightColumn($instance)] = $right;
        $attributes[$this->getParentColumn($instance)] = $parentId;

        $instance->setRawAttributes($attributes);
        $instance->save();
    }
}
