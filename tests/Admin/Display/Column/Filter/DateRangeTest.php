<?php

use Mockery as m;
use SleepingOwl\Admin\Display\Column\Filter\DateRange;

class DateRangeTest extends TestCase
{
    public function tearDown(): void
    {
        m::close();
    }

    /**
     * @return DateRange
     */
    public function getFilter()
    {
        return new DateRange;
    }

    public function test_initialize()
    {
        $filter = $this->getFilter();
        $filter->initialize();

        $this->assertTrue($filter->hasClassProperty('column-filter'));
        $this->assertEquals('daterange', $filter->getHtmlAttribute('data-type'));
    }

    public function test_gets_operator()
    {
        $filter = $this->getFilter();
        $this->assertEquals('between', $filter->getOperator());
    }

    /**
     * @dataProvider datesProvider
     */
    public function test_parse_value($string, $expected)
    {
        $filter = $this->getFilter();
        $filter->setPickerFormat('d.m.Y');
        $filter->setFormat('d-m-Y');

        $this->assertEquals($expected, $filter->parseValue($string));
    }

    public function datesProvider()
    {
        return [
            ['2021-01-01', ['01-01-2021']],
            ['2021-01-01 - 2021-01-02', ['01-01-2021', '02-01-2021']],
            ['01.01.2021 - 11.01.2021', ['01-01-2021', '11-01-2021']],
        ];
    }
}
