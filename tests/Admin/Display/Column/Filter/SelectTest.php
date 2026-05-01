<?php

use Mockery as m;
use SleepingOwl\Admin\Display\Column\Filter\Select;

class SelectTest extends TestCase
{
    public function tearDown(): void
    {
        m::close();
    }

    /**
     * @return Select
     */
    public function getFilter()
    {
        return new Select();
    }

    public function test_gets_or_sets_placeholder()
    {
        $filter = $this->getFilter();
        $filter->setPlaceholder('placeholder');

        $this->assertEquals('placeholder', $filter->getPlaceholder());
    }

    public function test_gets_options_with_placeholder()
    {
        $filter = $this->getFilter();
        $filter->setOptions(['1' => 'Option 1', '2' => 'Option 2']);
        $filter->setPlaceholder('All');

        $options = $filter->getOptions();

        $this->assertCount(3, $options);
        $this->assertArrayHasKey('', $options);
        $this->assertEquals('All', $options['']);
    }

    public function test_gets_options_without_placeholder_if_multiple()
    {
        $filter = $this->getFilter();
        $filter->multiple();
        $filter->setOptions(['1' => 'Option 1', '2' => 'Option 2']);
        $filter->setPlaceholder('All');

        $options = $filter->getOptions();

        $this->assertCount(2, $options);
        $this->assertArrayNotHasKey('', $options);
    }
}
