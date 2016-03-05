<?php

namespace SleepingOwl\Admin\Repository;

use Exception;
use Illuminate\Support\Collection;

class TreeRepository extends BaseRepository
{
    /**
     * Extrepat/Baum tree type
     * https://github.com/etrepat/baum.
     */
    const TreeTypeBaum = 0;

    /**
     * Lasychaser/Laravel-nestedset tree type
     * https://github.com/lazychaser/laravel-nestedset.
     */
    const TreeTypeKalnoy = 1;

    /**
     * Simple tree type (with `parent_id` and `order` fields).
     */
    const TreeTypeSimple = 2;

    /**
     * Tree type.
     * @var int
     */
    protected $type;

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
     * @param string $class
     */
    public function __construct($class)
    {
        parent::__construct($class);

        $this->detectType();
    }

    /**
     * Get tree structure.
     * @return mixed
     */
    public function getTree()
    {
        $collection = $this->getQuery()->get();

        switch ($this->getType()) {
            case static::TreeTypeBaum:
                return $collection->toHierarchy();
                break;

            case static::TreeTypeKalnoy:
                return $collection->toTree();
                break;

            case static::TreeTypeSimple:
                return $this->createSimpleTree();
                break;
        }
    }

    /**
     * Get or set tree type.
     *
     * @return int
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param int $type
     *
     * @return $this
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @param int $type
     *
     * @return bool
     */
    public function isType($type)
    {
        return $this->type == $type;
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
    public function reorder($data)
    {
        if ($this->isType(static::TreeTypeSimple)) {
            $this->recursiveReorderSimple($data, $this->getRootParentId());
        } else {
            $left = 1;
            foreach ($data as $root) {
                $left = $this->recursiveReorder($root, null, $left);
            }
        }
    }

    /**
     * Move tree node in nested-set tree type.
     *
     * @param $id
     * @param $parentId
     * @param $left
     * @param $right
     */
    public function move($id, $parentId, $left, $right)
    {
        $instance = $this->find($id);
        $attributes = $instance->getAttributes();
        $attributes[$this->getLeftColumn($instance)] = $left;
        $attributes[$this->getRightColumn($instance)] = $right;
        $attributes[$this->getParentColumn($instance)] = $parentId;
        $instance->setRawAttributes($attributes);
        $instance->save();
    }

    /**
     * Get left column name.
     *
     * @param $instance
     *
     * @return mixed
     * @throws Exception
     */
    public function getLeftColumn($instance)
    {
        $methods = [
            'getLeftColumnName',
            'getLftName',
        ];

        return $this->callMethods($instance, $methods);
    }

    /**
     * Get right column name.
     *
     * @param $instance
     *
     * @return mixed
     * @throws Exception
     */
    public function getRightColumn($instance)
    {
        $methods = [
            'getRightColumnName',
            'getRgtName',
        ];

        return $this->callMethods($instance, $methods);
    }

    /**
     * Get parent column name.
     *
     * @param $instance
     *
     * @return mixed
     * @throws Exception
     */
    public function getParentColumn($instance)
    {
        $methods = [
            'getParentColumnName',
            'getParentIdName',
        ];

        return $this->callMethods($instance, $methods);
    }

    /**
     * Detect tree type.
     * @return $this
     */
    protected function detectType()
    {
        if ($this->getModel() instanceof \Baum\Node) {
            return $this->setType(static::TreeTypeBaum);
        }

        if ($this->getModel() instanceof \Kalnoy\Nestedset\Node) {
            return $this->setType(static::TreeTypeKalnoy);
        }

        return $this->setType(static::TreeTypeSimple);
    }

    /**
     * Call several methods and get first result.
     *
     * @param $instance
     * @param $methods
     *
     * @return mixed
     * @throws Exception
     */
    protected function callMethods($instance, $methods)
    {
        foreach ($methods as $method) {
            if (method_exists($instance, $method)) {
                return $instance->$method();
            }
        }
        throw new Exception('Tree type not supported');
    }

    /**
     * Recursive reorder nested-set tree type.
     *
     * @param $root
     * @param $parentId
     * @param $left
     *
     * @return mixed
     */
    protected function recursiveReorder($root, $parentId, $left)
    {
        $right = $left + 1;
        $children = array_get($root, 'children', []);
        foreach ($children as $child) {
            $right = $this->recursiveReorder($child, $root['id'], $right);
        }
        $this->move($root['id'], $parentId, $left, $right);
        $left = $right + 1;

        return $left;
    }

    /**
     * Recursive reoder simple tree type.
     *
     * @param $data
     * @param $parentId
     */
    protected function recursiveReorderSimple($data, $parentId)
    {
        foreach ($data as $order => $item) {
            $id = $item['id'];

            $instance = $this->find($id);
            $instance->{$this->getParentField()} = $parentId;
            $instance->{$this->getOrderField()} = $order;
            $instance->save();

            if (isset($item['children'])) {
                $this->recursiveReorderSimple($item['children'], $id);
            }
        }
    }

    /**
     * Get children for simple tree type structure.
     *
     * @param $collection
     * @param $id
     *
     * @return static
     */
    protected function getChildren($collection, $id)
    {
        $parentField = $this->getParentField();
        $result = [];
        foreach ($collection as $instance) {
            if ($instance->$parentField != $id) {
                continue;
            }

            $instance->setRelation('children', $this->getChildren($collection, $instance->getKey()));
            $result[] = $instance;
        }

        return Collection::make($result);
    }

    /**
     * Create simple tree type structure.
     * @return static
     */
    protected function createSimpleTree()
    {
        $collection = $this->getQuery()
            ->orderBy($this->getParentField(), 'asc')
            ->orderBy($this->getOrderField(), 'asc')
            ->get();

        $parent = $this->getRootParentId();

        return $this->getChildren($collection, $parent);
    }
}
