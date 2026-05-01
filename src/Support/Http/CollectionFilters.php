<?php

namespace SleepingOwl\Admin\Support\Http;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;

abstract class CollectionFilters
{
    /**
     * The request object.
     *
     * @var Request
     */
    protected $request;

    /**
     * The builder instance.
     *
     * @var Collection
     */
    protected $collection;

    /**
     * Create a new QueryFilters instance.
     *
     * @param Request $request
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Apply the filters to the collection.
     *
     * @param Collection $collection
     *
     * @return Collection
     */
    public function apply(Collection $collection)
    {
        $this->collection = $collection;

        foreach ($this->filters() as $name => $value) {
            if (! method_exists($this, $name)) {
                continue;
            }

            if (is_array($value) or trim($value)) {
                $this->collection = $this->$name($value);
            } else {
                $this->collection = $this->$name();
            }
        }

        return $this->collection;
    }

    /**
     * Get all request filters data.
     *
     * @return array
     */
    public function filters()
    {
        return $this->request->all() + $this->request->route()->parameters();
    }
}
