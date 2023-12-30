<?php

use Mockery as m;

class ColumnActionTest extends TestCase
{
    public function tearDown(): void
    {
        m::close();
    }

    /**
     * @param  string  $name
     * @param  string|null  $title
     * @return \SleepingOwl\Admin\Display\Column\Action
     */
    protected function getColumn($name = 'test_name', $title = null)
    {
        return new \SleepingOwl\Admin\Display\Column\Action($name, $title);
    }

    public function test_constructor()
    {
        $column = $this->getColumn();

        $this->assertEquals('test_name', $column->getName());
        $this->assertNull($column->getTitle());

        $column = $this->getColumn('test', 'Test');
        $this->assertEquals('test', $column->getName());
        $this->assertEquals('Test', $column->getTitle());
    }

    public function test_initialize()
    {
        $column = $this->getColumn();

        $column->setAction('test_action');
        $column->setMethod('test_method');
        $column->initialize();

        $this->assertTrue($column->hasClassProperty('row-action'));
        $this->assertEquals('action', $column->getHtmlAttribute('name'));
        $this->assertEquals('test_name', $column->getHtmlAttribute('value'));
        $this->assertEquals('test_action', $column->getHtmlAttribute('data-action'));
        $this->assertEquals('test_method', $column->getHtmlAttribute('data-method'));
    }

    public function test_gets_or_sets_title()
    {
        $column = $this->getColumn();

        $column->setTitle('Title');
        $this->assertEquals('Title', $column->getTitle());
    }

    public function test_gets_or_sets_action()
    {
        $column = $this->getColumn();

        $column->setAction('Action');
        $this->assertEquals('Action', $column->getAction());
    }

    public function test_gets_or_sets_method()
    {
        $column = $this->getColumn();

        $this->assertEquals('post', $column->getMethod());

        $column->setMethod('put');
        $this->assertEquals('put', $column->getMethod());

        $column->useGet();
        $this->assertEquals('get', $column->getMethod());

        $column->usePost();
        $this->assertEquals('post', $column->getMethod());

        $column->usePut();
        $this->assertEquals('put', $column->getMethod());

        $column->useDelete();
        $this->assertEquals('delete', $column->getMethod());
    }

    public function test_gets_or_sets_icon()
    {
        $column = $this->getColumn();

        $column->setIcon('icon');
        $this->assertEquals('icon', $column->getIcon());
    }
}
