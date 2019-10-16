<?php

use Mockery as m;
use SleepingOwl\Admin\Display\TableHeaderColumn;

class TableHeaderColumnTest extends TestCase
{
    public function tearDown(): void
    {
        m::close();
    }

    /**
     * @return SleepingOwl\Admin\Display\TableHeaderColumn
     */
    protected function getHeader()
    {
        return new TableHeaderColumn();
    }

    /**
     * @covers SleepingOwl\Admin\Display\TableHeaderColumn::__construct
     */
    public function test_constructor()
    {
        $header = $this->getHeader();

        $this->assertEquals(' class="row-header"', $header->htmlAttributesToString());
    }

    /**
     * @covers SleepingOwl\Admin\Display\TableHeaderColumn::getTitle
     * @covers SleepingOwl\Admin\Display\TableHeaderColumn::setTitle
     */
    public function test_gets_and_sets_title()
    {
        $header = $this->getHeader();

        $this->assertNull($header->getTitle());

        $this->assertEquals($header, $header->setTitle('Title'));
        $this->assertEquals('Title', $header->getTitle());
    }

    /**
     * @covers SleepingOwl\Admin\Display\TableHeaderColumn::isOrderable
     * @covers SleepingOwl\Admin\Display\TableHeaderColumn::setOrderable
     */
    public function test_gets_and_sets_orderable()
    {
        $header = $this->getHeader();

        $this->assertFalse($header->isOrderable());

        $this->assertEquals($header, $header->setOrderable('Title'));
        $this->assertTrue($header->isOrderable());

        $header->setOrderable(0);
        $this->assertFalse($header->isOrderable());

        $header->setOrderable(1);
        $this->assertTrue($header->isOrderable());

        $header->setOrderable(true);
        $this->assertTrue($header->isOrderable());

        $header->setOrderable(false);
        $this->assertFalse($header->isOrderable());
    }

    /**
     * @covers SleepingOwl\Admin\Display\TableHeaderColumn::getView
     * @covers SleepingOwl\Admin\Display\TableHeaderColumn::setView
     */
    public function test_gets_and_sets_view()
    {
        $header = $this->getHeader();

        $this->assertEquals('column.header', $header->getView());

        $this->assertEquals($header, $header->setView('custom.template'));
        $this->assertEquals('custom.template', $header->getView());
    }

    /**
     * @covers SleepingOwl\Admin\Display\TableHeaderColumn::toArray
     */
    public function test_toArray()
    {
        $header = $this->getHeader();
        $header->setTitle('Title');

        $this->assertEquals([
            'attributes'  => ' class="row-header" data-orderable="false"',
            'title'       => $header->getTitle(),
            'isOrderable' => $header->isOrderable(),
        ], $header->toArray());
    }

    /**
     * @covers SleepingOwl\Admin\Display\TableHeaderColumn::toArray
     */
    public function test_render()
    {
        $header = $this->getHeader();

        $this->getTemplateMock()->shouldReceive('view')->once()->with($header->getView(), [
            'attributes'  => ' class="row-header" data-orderable="false"',
            'title'       => $header->getTitle(),
            'isOrderable' => $header->isOrderable(),
        ])->andReturn('html');

        $this->assertEquals('html', $header->render());
    }

    /**
     * @covers SleepingOwl\Admin\Display\TableHeaderColumn::toArray
     */
    public function test_render_orderable()
    {
        $header = $this->getHeader();

        $header->setOrderable(true);

        $this->getTemplateMock()->shouldReceive('view')->once()->with($header->getView(), [
            'attributes'  => ' class="row-header" data-orderable="true"',
            'title'       => $header->getTitle(),
            'isOrderable' => $header->isOrderable(),
        ])->andReturn('html');

        $this->assertEquals('html', $header->render());
    }
}
