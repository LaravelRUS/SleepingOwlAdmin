<?php

namespace SleepingOwl\Admin\Contracts\Repositories;

use Illuminate\Database\Eloquent\Collection;

interface TreeRepositoryInterface extends RepositoryInterface
{
    /**
     * Get tree structure.
     *
     * @param Collection $collection
     * @return mixed
     */
    public function getTree(Collection $collection);

    /**
     * Get parent field name.
     *
     * @return string
     */
    public function getParentField(): string;

    /**
     * @param string $parentField
     * @return $this
     */
    public function setParentField(string $parentField): self;

    /**
     * Get order field name.
     *
     * @return string
     */
    public function getOrderField(): string;

    /**
     * @param string $orderField
     * @return $this
     */
    public function setOrderField(string $orderField): self;

    /**
     * Get or set parent field name.
     *
     * @return string|null
     */
    public function getRootParentId(): ?string;

    /**
     * @param string $rootParentId
     * @return $this
     */
    public function setRootParentId(string $rootParentId): self;

    /**
     * Reorder tree by $data value.
     *
     * @param $data
     */
    public function reorder(array $data);
}
