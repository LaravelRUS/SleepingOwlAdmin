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

        $id = str_random(10);

        $this->setHtmlAttribute('class', 'datatables');
        $this->setHtmlAttribute('data-id', $id);
        $this->getColumnFilters()->setHtmlAttribute('data-datatables-id', $id);

        $this->setHtmlAttribute('data-order', json_encode($this->getOrder()));

        foreach ($this->getColumns()->all() as $column) {
            $this->datatableAttributes['columns'][] = [
                'orderDataType' => class_basename($column)
            ];
        }

        $this->setHtmlAttribute('data-attributes', json_encode($this->getDatatableAttributes()));
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
     *
     * @return $this
     */
    public function setDatatableAttributes(array $datatableAttributes)
    {
        $this->datatableAttributes = $datatableAttributes;

        return $this;
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
