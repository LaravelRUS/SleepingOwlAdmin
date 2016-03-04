<?php

namespace SleepingOwl\Admin\Display;

class DisplayDatatables extends DisplayTable
{
    const FILTER_POSITION_TOP = 0;
    const FILTER_POSITION_BOTTOM = 2;
    const FILTER_POSITION_BOTH = 2;

    /**
     * @var array
     */
    protected $order = [[0, 'asc']];

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

        $this->setAttribute('class', 'datatables');
        $this->setAttribute('data-order', json_encode($this->getOrder()));
        $this->setAttribute('data-attributes', json_encode($this->getDatatableAttributes(), JSON_FORCE_OBJECT));
    }

    /**
     * TODO: сделать чтобы работал.
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
     * Get view render parameters.
     * @return array
     */
    public function toArray()
    {
        $params = parent::toArray();

        $params['order'] = $this->getOrder();

        return $params;
    }
}
