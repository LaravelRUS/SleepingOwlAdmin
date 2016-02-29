<?php

namespace SleepingOwl\Admin\Display;

use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\ColumnFilterInterface;

class DisplayDatatables extends DisplayTable
{
    const FILTER_POSITION_TOP = 0;
    const FILTER_POSITION_BOTTOM = 2;
    const FILTER_POSITION_BOTH = 2;

    /**
     * View to render.
     * @var string
     */
    protected $view = 'datatables';

    /**
     * @var array
     */
    protected $order = [[0, 'asc']];

    /**
     * @var ColumnFilterInterface[]
     */
    protected $columnFilters = [];

    /**
     * @var array
     */
    protected $datatableAttributes = [];

    /**
     * @var int
     */
    protected $filterPosition = self::FILTER_POSITION_BOTH;

    /**
     * Initialize display.
     */
    public function initialize()
    {
        parent::initialize();
        foreach ($this->getColumnFilters() as $columnFilter) {
            if ($columnFilter instanceof Initializable) {
                $columnFilter->initialize();
            }
        }

        $this->setAttribute('class', 'datatables');
        $this->setAttribute('data-order', json_encode($this->getOrder()));
        $this->setAttribute('data-attributes', json_encode($this->getDatatableAttributes(), JSON_FORCE_OBJECT));
    }

    /**
     * TODO: сделать чтобы работал
     * @return array
     */
    public function getDatatableAttributes()
    {
        return $this->datatableAttributes;
    }

    /**
     * @param array $datatableAttributes
     */
    public function setDatatableAttributes(array $datatableAttributes)
    {
        $this->datatableAttributes = $datatableAttributes;
    }

    /**
     * @return int
     */
    public function getFilterPosition()
    {
        return $this->filterPosition;
    }

    /**
     * @param int $filterPosition
     */
    public function setFilterPosition($filterPosition)
    {
        $this->filterPosition = $filterPosition;
    }

    /**
     * @return array
     */
    public function getOrder()
    {
        return $this->order;
    }

    /**
     * @param array $order
     *
     * @return $this
     */
    public function setOrder($order)
    {
        if (! is_array($order)) {
            $order = func_get_args();
        }

        $this->order = $order;

        return $this;
    }

    /**
     * @return ColumnFilterInterface[]
     */
    public function getColumnFilters()
    {
        return $this->columnFilters;
    }

    /**
     * @param array|ColumnFilterInterface $columnFilters
     *
     * @return $this
     */
    public function setColumnFilters($columnFilters)
    {
        if (! is_array($columnFilters)) {
            $columnFilters = func_get_args();
        }

        $this->columnFilters = $columnFilters;

        return $this;
    }

    /**
     * Get view render parameters.
     * @return array
     */
    public function toArray()
    {
        $params = parent::toArray();

        $params['order'] = $this->getOrder();
        $params['columnFilters'] = $this->getColumnFilters();
        $params['filterPosition'] = $this->getFilterPosition();

        return $params;
    }
}
