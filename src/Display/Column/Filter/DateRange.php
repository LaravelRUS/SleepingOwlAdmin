<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

class DateRange extends Date
{
    /**
     * @var string
     */
    protected $view = 'column.filter.daterange';

    /**
     * Initialize column filter.
     */
    public function initialize()
    {
        parent::initialize();

        $this->setHtmlAttribute('data-type', 'daterange');
    }

    /**
     * @return string
     */
    public function getOperator()
    {
        return 'between';
    }

    /**
     * @param string $date
     * @return array|string
     */
    public function parseValue($date)
    {
        $dates = explode('::', $date, 2);

        foreach ($dates as $i => $data) {
            $dates[$i] = parent::parseValue($data);
        }

        return $dates;
    }
}
