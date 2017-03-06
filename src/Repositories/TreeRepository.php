<?php

namespace SleepingOwl\Admin\Repositories;

use Exception;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\Display\Tree\TreeTypeInterface;
use SleepingOwl\Admin\Contracts\Repositories\TreeRepositoryInterface;
use SleepingOwl\Admin\Display\Tree\BaumNodeType;
use SleepingOwl\Admin\Display\Tree\KalnoyNestedsetType;
use SleepingOwl\Admin\Display\Tree\SimpleTreeType;
use SleepingOwl\Admin\Exceptions\Display\DisplayTreeException;

class TreeRepository extends BaseRepository implements TreeRepositoryInterface
{

    /**
     * Parent field name.
     * @var string
     */
    protected $parentField = 'parent_id';

    /**
     * Order field name.
     * @var string
     */
    protected $orderField = 'order';

    /**
     * Root parent id value.
     * @var null
     */
    protected $rootParentId = null;

    /**
     * @var TreeTypeInterface
     */
    protected $treeType;

    /**
     * @param string $treeType
     */
    public function __construct($treeType = null)
    {
        if (! is_null($treeType)) {
            $this->setTreeType($treeType);
        }
    }

    /**
     * @param string $treeType
     *
     * @throws DisplayTreeException
     */
    public function setTreeType($treeType)
    {
        $this->treeType = new $treeType($this);

        if (! ($this->treeType instanceof TreeTypeInterface)) {
            throw new DisplayTreeException('Tree type class must be instanced of [SleepingOwl\Admin\Contracts\Display\Tree\TreeTypeInterface]');
        }
    }

    /**
     * @param string $class
     *
     * @return $this
     */
    public function setClass($class)
    {
        parent::setClass($class);

        if (is_null($this->treeType)) {
            $this->detectType();
        }

        return $this;
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
        return $this->treeType->getTree($collection);
    }

    /**
     * Get parent field name.
     *
     * @return string
     */
    public function getParentField()
    {
        return $this->parentField;
    }

    /**
     * @param string $parentField
     *
     * @return $this
     */
    public function setParentField($parentField)
    {
        $this->parentField = $parentField;

        return $this;
    }

    /**
     * Get order field name.
     *
     * @return string
     */
    public function getOrderField()
    {
        return $this->orderField;
    }

    /**
     * @param string $orderField
     *
     * @return $this
     */
    public function setOrderField($orderField)
    {
        $this->orderField = $orderField;

        return $this;
    }

    /**
     * Get or set parent field name.
     *
     * @return string
     */
    public function getRootParentId()
    {
        return $this->rootParentId;
    }

    /**
     * @param string $rootParentId
     *
     * @return $this
     */
    public function setRootParentId($rootParentId)
    {
        $this->rootParentId = $rootParentId;

        return $this;
    }

    /**
     * Reorder tree by $data value.
     *
     * @param $data
     */
    public function reorder(array $data)
    {
        $this->treeType->reorder($data);
    }

    /**
     * Detect tree type.
     * @return $this
     */
    protected function detectType()
    {
        $model = $this->getModel();

        $type = SimpleTreeType::class;

        if ($model instanceof \Baum\Node) {
            $type = BaumNodeType::class;
        } else  if (class_exists('Kalnoy\Nestedset\Node') and $model instanceof \Kalnoy\Nestedset\Node) {
            $type = KalnoyNestedsetType::class;
        } elseif (function_exists('trait_uses_recursive') and $traits = trait_uses_recursive($model) and in_array('Kalnoy\Nestedset\NodeTrait', $traits)) {
            $type = KalnoyNestedsetType::class;
        } elseif ($traits = class_uses($model) and in_array('Kalnoy\Nestedset\NodeTrait', $traits)) {
            $type = KalnoyNestedsetType::class;
        }

        $this->setTreeType($type);
    }

    /**
     * Get children for simple tree type structure.
     *
     * @param $collection
     * @param $id
     *
     * @return Collection
     */
    protected function getChildren($collection, $id)
    {
        $parentField = $this->getParentField();
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
