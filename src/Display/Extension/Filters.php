<?php

namespace SleepingOwl\Admin\Display\Extension;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\Display\Extension\FilterInterface;
use SleepingOwl\Admin\Contracts\Initializable;

class Filters extends Extension implements Initializable
{
    /**
     * @var FilterInterface[]|Collection
     */
    protected $filters;

    /**
     * @var string
     */
    protected $title;

    public function __construct()
    {
        $this->clear();
    }

    /**
     * @return $this
     */
    public function clear()
    {
        $this->filters = new Collection();

        return $this;
    }

    /**
     * @param  array|FilterInterface  $filters
     * @return \SleepingOwl\Admin\Contracts\Display\DisplayInterface
     */
    public function set($filters)
    {
        if (! is_array($filters)) {
            $filters = func_get_args();
        }

        $this->clear();

        foreach ($filters as $filter) {
            $this->push($filter);
        }

        return $this->getDisplay();
    }

    /**
     * @return Collection|FilterInterface[]
     */
    public function all()
    {
        return $this->filters;
    }

    /**
     * @param  FilterInterface  $filter
     * @return $this
     */
    public function push(FilterInterface $filter)
    {
        $this->filters->push($filter);

        return $this;
    }

    /**
     * @return FilterInterface[]|Collection
     */
    public function getActive()
    {
        return $this->filters->filter(function (FilterInterface $filter) {
            return $filter->isActive();
        });
    }

    /**
     * @param  string  $title
     * @return $this
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        return app('sleeping_owl.template')->view('display.extensions.filter_title', [
            'filter_title' => $this->title,
            'filters' => $this->getActive(),
        ])->render();
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return [
            'filters' => $this->filters->toArray(),
            'title' => $this->getTitle(),
        ];
    }

    /**
     * @param  Builder  $query
     */
    public function modifyQuery(Builder $query)
    {
        $this->getActive()->each(function (FilterInterface $filter) use ($query) {
            $filter->apply($query);
        });
    }

    /**
     * Initialize class.
     */
    public function initialize()
    {
        $this->filters->each(function (FilterInterface $filter) {
            $filter->initialize();
        });
    }
}
