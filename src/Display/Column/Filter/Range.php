<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

use SleepingOwl\Admin\Contracts\Display\Extension\ColumnFilterInterface;

class Range extends BaseColumnFilter
{
    /**
     * @var string
     */
    protected $view = 'column.filter.range';

    /**
     * @var bool
     */
    protected $inline = false;

    /**
     * @var ColumnFilterInterface|BaseColumnFilter
     */
    protected $from;

    /**
     * @var ColumnFilterInterface|BaseColumnFilter
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

        if ($this->inline) {
            $this->setHtmlAttribute('class', 'inline');
        }

        $this->getFrom()->initialize();
        $this->getTo()->initialize();

        $this->getFrom()->removeHtmlAttribute('data-type');
        $this->getTo()->removeHtmlAttribute('data-type');
    }

    /**
     * @param $inline
     * @return $this
     */
    public function setInline($inline)
    {
        $this->inline = $inline;

        return $this;
    }

    /**
     * @return ColumnFilterInterface|BaseColumnFilter
     */
    public function getFrom()
    {
        return $this->from;
    }

    /**
     * @param  ColumnFilterInterface  $from
     * @return $this
     */
    public function setFrom(ColumnFilterInterface $from)
    {
        $this->from = $from;

        return $this;
    }

    /**
     * @return ColumnFilterInterface|BaseColumnFilter
     */
    public function getTo()
    {
        return $this->to;
    }

    /**
     * @param  ColumnFilterInterface  $to
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
            'to' => $this->getTo(),
        ];
    }

    /**
     * @param  mixed  $range
     * @return array|mixed|null|void
     *
     * @throws \SleepingOwl\Admin\Exceptions\FilterOperatorException
     */
    public function parseValue($range)
    {
        if (strpos($range, '::') === false) {
            return;
        }

        $from = $this->from->parseValue(explode('::', $range, 2)[0]);
        $to = $this->to->parseValue(explode('::', $range, 2)[1]);

        if (! empty($from) && ! empty($to)) {
            $this->setOperator('between');

            return [$from, $to];
        } elseif (! empty($from)) {
            $this->setOperator('greater_or_equal');

            return $from;
        } elseif (! empty($to)) {
            $this->setOperator('less_or_equal');

            return $to;
        }
    }
}
