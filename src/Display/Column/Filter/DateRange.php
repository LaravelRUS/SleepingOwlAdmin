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
     *
     * @return string
     */
    public function parserValue($date)
    {
        $dates = explode('::', $date);

        foreach ($dates as $i => $date) {
            $dates[$i] = parent::parserValue($date);
        }

        return $dates;
    }
}
