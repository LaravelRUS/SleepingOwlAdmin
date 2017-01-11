<?php

use Mockery as m;
use SleepingOwl\Admin\Display\Column\Filter\Date;

class DateTest extends TestCase
{
    public function tearDown()
    {
        m::close();
    }

    /**
     * @return Date
     */
    public function getFilter()
    {
        return new Date;
    }

    public function test_initialize()
    {
        $filter = $this->getFilter();
        $filter->initialize();

        $this->assertTrue($filter->hasClassProperty('column-filter'));
        $this->assertEquals('date', $filter->getHtmlAttribute('data-type'));
    }

    public function test_gets_or_sets_format()
    {
        $filter = $this->getFilter();
        $filter->setFormat('d.f.Y');

        $this->assertEquals('d.f.Y', $filter->getFormat());
    }

    public function test_sets_or_gets_seconds()
    {
        $filter = $this->getFilter();
        $this->assertFalse($filter->hasSeconds());

        $filter->showSeconds();
        $this->assertTrue($filter->hasSeconds());

        $filter->showSeconds(false);
        $this->assertFalse($filter->hasSeconds());
    }

    public function test_gets_or_sets_picker_format()
    {
        $filter = $this->getFilter();

        $config = $this->getConfigMock();

        $config->shouldReceive('get')->with('sleeping_owl.dateFormat', null)->andReturn('d.f.Y');

        $this->assertEquals('d.f.Y', $filter->getPickerFormat());

        $filter->setPickerFormat('d.m.Y');
        $this->assertEquals('d.m.Y', $filter->getPickerFormat());
    }

    /**
     * @dataProvider widthProvider
     */
    public function test_gets_or_sets_width($width, $expected)
    {
        $filter = $this->getFilter();

        $filter->setWidth($width);
        $this->assertEquals($expected, $filter->getWidth());
    }

    public function widthProvider()
    {
        return [
            'integer' => [100, 100],
            'string_int' => ['100', 100],
            'string_int_with_text' => ['150px', 150],
            'negative_number' => [-100, 0],
            'zero' => [0, 0],
        ];
    }

    /**
     * @dataProvider datesProvider
     */
    public function test_parse_value($date, $pickerFormat, $format, $expected)
    {
        $filter = $this->getFilter();
        $filter->setFormat($format);
        $filter->setPickerFormat($pickerFormat);

        $this->assertEquals($expected, $filter->parseValue($date));
    }

    public function datesProvider()
    {
        return [
            'db_format' => ['2016-05-23', 'd.F.Y', 'd.m.Y', '23.05.2016'],
            'string_format' => ['today', 'd.F.Y', 'd.m.Y', date('d.m.Y')],
            'invalid_date' => ['2016:01:01', 'd.F.Y', 'd.m.Y', null],
            'picker_format' => ['2016:01:01', 'Y:m:d', 'Y-m-d', '2016-01-01'],
            'empty_date' => ['', 'Y:m:d', 'Y-m-d', null],
            'null_date' => [null, 'Y:m:d', 'Y-m-d', null],
        ];
    }
}
