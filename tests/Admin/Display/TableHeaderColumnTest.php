<?php

use Mockery as m;
use SleepingOwl\Admin\Display\TableHeaderColumn;

class TableHeaderColumnTest extends TestCase
{
    public function tearDown()
    {
        m::close();
    }

    /**
     * @return TableHeaderColumn
     */
    protected function getHeader()
    {
        return new TableHeaderColumn();
    }

    /**
     * @covers TableHeaderColumn::__construct
     */
    public function test_constructor()
    {
        $header = $this->getHeader();

        $this->assertEquals(' class="row-header"', $header->htmlAttributesToString());
    }

    /**
     * @covers TableHeaderColumn::getTitle
     * @covers TableHeaderColumn::setTitle
     */
    public function test_gets_and_sets_title()
    {
        $header = $this->getHeader();

        $this->assertNull($header->getTitle());

        $this->assertEquals($header, $header->setTitle('Title'));
        $this->assertEquals('Title', $header->getTitle());
    }

    /**
     * @covers TableHeaderColumn::isOrderable
     * @covers TableHeaderColumn::setOrderable
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
     * @covers TableHeaderColumn::getView
     * @covers TableHeaderColumn::setView
     */
    public function test_gets_and_sets_view()
    {
        $header = $this->getHeader();

        $this->assertEquals('column.header', $header->getView());

        $this->assertEquals($header, $header->setView('custom.template'));
        $this->assertEquals('custom.template', $header->getView());
    }

    /**
     * @covers TableHeaderColumn::toArray
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
     * @covers TableHeaderColumn::toArray
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
     * @covers TableHeaderColumn::toArray
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
