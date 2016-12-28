<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

use Illuminate\Database\Eloquent\Builder;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Contracts\NamedColumnInterface;
use SleepingOwl\Admin\Contracts\ColumnFilterInterface;

class Range extends BaseColumnFilter
{
    /**
     * @var string
     */
    protected $view = 'column.filter.range';

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

        $this->setHtmlAttribute('data-type', 'range');
        $this->setHtmlAttribute('class', 'column-filter');

        $this->getFrom()->initialize();
        $this->getTo()->initialize();

        $this->getFrom()->removeHtmlAttribute('data-type');
        $this->getTo()->removeHtmlAttribute('data-type');
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
        if (strpos($search, '::') === false) {
            return;
        }

        list($from, $to) = explode('::', $search, 2);
        $from = $this->from->parseValue($from);
        $to = $this->to->parseValue($to);

        $name = $column->getName();

        if (! empty($from) && ! empty($to)) {
            $this->setOperator('between');
            $search = [$from, $to];
        } elseif (! empty($from)) {
            $this->setOperator('greater_or_equal');
            $search = $from;
        } elseif (! empty($to)) {
            $this->setOperator('less_or_equal');
            $search = $to;
        } else {
            return;
        }

        if ($repository->hasColumn($name)) {
            $this->buildQuery($query, $name, $search);
        } elseif (strpos($name, '.') !== false) {
            $parts = explode('.', $name);
            $fieldName = array_pop($parts);
            $relationName = implode('.', $parts);
            $query->whereHas($relationName, function ($q) use ($search, $fieldName) {
                $this->buildQuery($q, $fieldName, $search);
            });
        }
    }
}
