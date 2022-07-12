<?php

namespace SleepingOwl\Admin\Repositories;

use Illuminate\Database\Eloquent\Collection;
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
     *
     * @var string
     */
    protected $parentField = 'parent_id';

    /**
     * Order field name.
     *
     * @var string
     */
    protected $orderField = 'order';

    /**
     * Root parent id value.
     *
     * @var null
     */
    protected $rootParentId = null;

    /**
     * @var TreeTypeInterface
     */
    protected $treeType;

    /**
     * @param  string  $treeType
     */
    public function __construct($treeType = null)
    {
        if (! is_null($treeType)) {
            $this->setTreeType($treeType);
        }
    }

    /**
     * @param  string  $treeType
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
     * @param  string  $class
     * @return $this
     */
    public function setClass(string $class): self
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
     * @param  Collection  $collection
     * @return mixed
     */
    public function getTree(Collection $collection)
    {
        return $this->treeType->getTree($collection);
    }

    /**
     * Get parent field name.
     *
     * @return string
     */
    public function getParentField(): string
    {
        return $this->parentField;
    }

    /**
     * @param  string  $parentField
     * @return $this
     */
    public function setParentField(string $parentField): self
    {
        $this->parentField = $parentField;

        return $this;
    }

    /**
     * Get order field name.
     *
     * @return string
     */
    public function getOrderField(): string
    {
        return $this->orderField;
    }

    /**
     * @param  string  $orderField
     * @return $this
     */
    public function setOrderField(string $orderField): self
    {
        $this->orderField = $orderField;

        return $this;
    }

    /**
     * Get or set parent field name.
     *
     * @return string|null
     */
    public function getRootParentId(): ?string
    {
        return $this->rootParentId;
    }

    /**
     * @param  string|null  $rootParentId
     * @return $this
     */
    public function setRootParentId(?string $rootParentId): self
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
     *
     * @return $this
     */
    protected function detectType()
    {
        $model = $this->getModel();
        $traits = trait_uses_recursive($model);
        $type = SimpleTreeType::class;

        if ($model instanceof \Baum\Node) {
            $type = BaumNodeType::class;
        } elseif (class_exists('Kalnoy\Nestedset\Node') && $model instanceof \Kalnoy\Nestedset\Node) {
            $type = KalnoyNestedsetType::class;
        } elseif (function_exists('trait_uses_recursive') && in_array('Kalnoy\Nestedset\NodeTrait', $traits)) {
            $type = KalnoyNestedsetType::class;
        } elseif (class_uses($model) && in_array('Kalnoy\Nestedset\NodeTrait', class_uses($model))) {
            $type = KalnoyNestedsetType::class;
        }

        $this->setTreeType($type);
    }
}
