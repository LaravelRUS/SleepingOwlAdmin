<?php

use SleepingOwl\Admin\Form\Element\DateTime;

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
}
