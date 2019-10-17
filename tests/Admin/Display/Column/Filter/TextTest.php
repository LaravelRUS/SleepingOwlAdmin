<?php

use Mockery as m;
use SleepingOwl\Admin\Display\Column\Filter\Text;

class TextTest extends TestCase
{
    public function tearDown(): void
    {
        m::close();
    }

    /**
     * @return Text
     */
    public function getFilter()
    {
        return new Text;
    }

    public function test_initialize()
    {
        $filter = $this->getFilter();
        $filter->initialize();

        $this->assertEquals('text', $filter->getHtmlAttribute('data-type'));
        $this->assertEquals('text', $filter->getHtmlAttribute('type'));
        $this->assertEquals($filter->getPlaceholder(), $filter->getHtmlAttribute('placeholder'));
        $this->assertTrue($filter->hasClassProperty('column-filter'));
    }

    public function test_gets_or_sets_placeholder()
    {
        $filter = $this->getFilter();
        $filter->setPlaceholder('placeholder');

        $this->assertEquals('placeholder', $filter->getPlaceholder());
    }
}
