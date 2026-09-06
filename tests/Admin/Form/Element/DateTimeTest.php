<?php

use SleepingOwl\Admin\Form\Element\DateTime;
use SleepingOwl\Admin\Form\Element\Date;
use SleepingOwl\Admin\Form\Element\Time;
use SleepingOwl\Admin\Form\Element\Timestamp;

class DateTimeTest extends TestCase
{
    /**
     * @return DateTime
     *
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormElementException
     */
    protected function getElement()
    {
        return new DateTime('test', 'Test');
    }

    public function test_create_class_from_alias()
    {
        $this->assertInstanceOf(DateTime::class, AdminFormElement::datetime('test', 'Test'));
    }

    /**
     * @covers SleepingOwl\Admin\Form\Element\DateTime::getFormat
     * @covers SleepingOwl\Admin\Form\Element\DateTime::setFormat
     */
    public function test_gets_and_sets_format()
    {
        $element = $this->getElement();

        $this->assertEquals('Y-m-d H:i:s', $element->getFormat());

        $element->setFormat($format = 'd.F.Y');
        $this->assertEquals($format, $element->getFormat());
    }

    /**
     * @covers SleepingOwl\Admin\Form\Element\DateTime::getFormat
     * @covers SleepingOwl\Admin\Form\Element\DateTime::setFormat
     */
    public function test_gets_and_sets_picker_format()
    {
        $element = $this->getElement();

        $this->assertEquals($this->app['config']['sleeping_owl.datetimeFormat'], $element->getPickerFormat());

        $element->setPickerFormat($format = 'd.F.Y');
        $this->assertEquals($format, $element->getPickerFormat());
    }

    public function test_date_family_exposes_explicit_native_control_types(): void
    {
        $elements = [
            'date' => (new Date('date'))->setExactValue('06-09-2026'),
            'datetime' => (new DateTime('datetime'))->setExactValue('06-09-2026 14:25'),
            'time' => (new Time('time'))->setExactValue('14:25'),
            'timestamp' => (new Timestamp('timestamp'))->setExactValue('06-09-2026 14:25'),
        ];

        $this->assertSame('date', $elements['date']->toArray()['attributesArray']['data-soa-date-control']);
        $this->assertSame('datetime', $elements['datetime']->toArray()['attributesArray']['data-soa-date-control']);
        $this->assertSame('time', $elements['time']->toArray()['attributesArray']['data-soa-date-control']);
        $this->assertSame('datetime', $elements['timestamp']->toArray()['attributesArray']['data-soa-date-control']);
    }
}
