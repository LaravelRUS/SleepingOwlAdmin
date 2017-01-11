<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

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
     * @param string $range
     *
     * @return string
     */
    public function parseValue($range)
    {
        if (strpos($range, '::') === false) {
            return;
        }

        list($from, $to) = explode('::', $range, 2);
        $from = $this->from->parseValue($from);
        $to = $this->to->parseValue($to);

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
