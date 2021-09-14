<?php

namespace SleepingOwl\Admin\Display;

use Illuminate\Support\Str;

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

        $id = Str::random(10);

        $this->setHtmlAttribute('class', 'datatables');
        $this->setHtmlAttribute('data-id', $id);
        $this->getColumnFilters()->setHtmlAttribute('data-datatables-id', $id);

        $this->setHtmlAttribute('data-order', json_encode($this->getOrder()));

        $attributes = $this->getDatatableAttributes();

        $attributes['pageLength'] = $this->paginate;

        $attributes['language'] = trans('sleeping_owl::lang.table');

        foreach ($this->getColumns()->all() as $column) {
            $attributes['columns'][] = [
                'orderable' => $column->isOrderable(),
                'visible' => $column->isVisible(),
                'width' => $column->getWidth(),
                'orderDataType' => class_basename($column),
            ];
        }

        $this->setHtmlAttribute('data-attributes', json_encode($attributes));
    }

    /**
     * @return array
     */
    public function getDatatableAttributes()
    {
        return array_merge(config('sleeping_owl.datatables', []), (array) $this->datatableAttributes);
    }

    /**
     * @param  array  $datatableAttributes
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
     * @param  array  $order
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
     * @return bool
     */
    public function usePagination()
    {
        return false;
    }

    /**
     * @return $this
     */
    public function disablePagination()
    {
        $this->paginate = -1;

        return $this;
    }

    /**
     * @return array
     *
     * @throws \Exception
     */
    public function toArray()
    {
        $params = parent::toArray();

        $params['order'] = $this->getOrder();

        return $params;
    }
}
