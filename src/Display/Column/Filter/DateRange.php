<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

class DateRange extends Date
{
    /**
     * @var string
     */
    protected $view = 'column.filter.daterange';

    /**
     * @var string
     */
    protected $mode = 'date';

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
     * @param  string  $date
     * @param  bool  $add_day
     * @return array|string
     *
     * @throws \SleepingOwl\Admin\Exceptions\FilterOperatorException
     */
    public function parseValue($date, $add_day = false)
    {
        if ($date === null) {
            return ['0000-00-00', '9999-12-31'];
        }

        $dates = explode(' - ', $date, 2);

        foreach ($dates as $i => $data) {
            $add_day = $i == 1 && $this->getMode() == 'datetime';
            $dates[$i] = parent::parseValue($data, $add_day);
        }

        return $dates;
    }

    /**
     * @return string
     */
    public function getMode()
    {
        return $this->mode;
    }

    /**
     * @return $this
     */
    public function forDate()
    {
        $this->mode = 'date';

        return $this;
    }

    /**
     * @return $this
     */
    public function forDateTime()
    {
        $this->mode = 'datetime';

        return $this;
    }
}
