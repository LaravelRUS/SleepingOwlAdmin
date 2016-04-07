<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

use Illuminate\Database\Eloquent\Builder;
use SleepingOwl\Admin\Contracts\FilterInterface;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Contracts\NamedColumnInterface;
use SleepingOwl\Admin\Contracts\ColumnFilterInterface;

class Range extends BaseColumnFilter
{
    /**
     * @var string
     */
    protected $view = 'range';

    /**
     * @var ColumnFilterInterface
     */
    protected $from;

    /**
     * @var ColumnFilterInterface
     */
    protected $to;

    /**
     * Initialize column filter.
     */
    public function initialize()
    {
        parent::initialize();

        $this->getFrom()->initialize();
        $this->getTo()->initialize();
    }

    /**
     * @return ColumnFilterInterface
     */
    public function getFrom()
    {
        return $this->from;
    }

    /**
     * @param ColumnFilterInterface $from
     *
     * @return $this
     */
    public function setFrom(ColumnFilterInterface $from)
    {
        $this->from = $from;

        return $this;
    }

    /**
     * @return ColumnFilterInterface
     */
    public function getTo()
    {
        return $this->to;
    }

    /**
     * @param ColumnFilterInterface $to
     *
     * @return $this
     */
    public function setTo(ColumnFilterInterface $to)
    {
        $this->to = $to;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'from' => $this->getFrom(),
            'to'   => $this->getTo(),
        ];
    }

    /**
     * @param RepositoryInterface  $repository
     * @param NamedColumnInterface $column
     * @param Builder              $query
     * @param string               $search
     * @param array|string         $fullSearch
     *
     * @return void
     */
    public function apply(
        RepositoryInterface $repository,
        NamedColumnInterface $column,
        Builder $query,
        $search,
        $fullSearch
    ) {
        $from = array_get($fullSearch, 'from');
        $to = array_get($fullSearch, 'to');

        if (! empty($from)) {
            $this
                ->getFrom()
                ->setOperator(FilterInterface::LESS_OR_EQUAL)
                ->apply($repository, $column, $query, $from, $fullSearch);
        }

        if (! empty($to)) {
            $this
                ->getTo()
                ->setOperator(FilterInterface::LESS_OR_EQUAL)
                ->apply($repository, $column, $query, $to, $fullSearch);
        }
    }
}
