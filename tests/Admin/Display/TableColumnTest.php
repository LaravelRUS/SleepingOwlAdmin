<?php

use Mockery as m;
use SleepingOwl\Admin\Contracts\Display\ColumnInterface;
use SleepingOwl\Admin\Contracts\Display\TableHeaderColumnInterface;
use SleepingOwl\Admin\Display\TableColumn;

class TableColumnTest extends TestCase
{
    use \SleepingOwl\Tests\AssetsTesterTrait;

    public function tearDown(): void
    {
        m::close();
    }

    /**
     * @param  null  $label
     * @return \PHPUnit\Framework\MockObject\MockObject
     *
     * @throws ReflectionException
     */
    protected function getColumn($label = null)
    {
        return $this->getMockForAbstractClass(TableColumn::class, [$label]);
    }

    /**
     * @covers SleepingOwl\Admin\Display\TableColumn::__construct
     * @covers SleepingOwl\Admin\Display\TableColumn::getHeader
     */
    public function test_constructor_without_label()
    {
        $this->app->instance(TableHeaderColumnInterface::class, $header = m::mock(TableHeaderColumnInterface::class));

        $this->packageIncluded();

        $header->shouldNotReceive('setTitle');

        $column = $this->getColumn();
        $this->assertEquals($header, $column->getHeader());
    }

    /**
     * @covers SleepingOwl\Admin\Display\TableColumn::getWidth
     * @covers SleepingOwl\Admin\Display\TableColumn::setWidth
     */
    public function test_gets_and_sets_width()
    {
        $column = $this->getColumn();

        $this->assertNull($column->getWidth());

        $this->assertEquals($column, $column->setWidth(1000));
        $this->assertEquals('1000px', $column->getWidth());

        $column->setWidth('100px');
        $this->assertEquals('100px', $column->getWidth());
    }

    /**
     * @covers SleepingOwl\Admin\Display\TableColumn::getView
     * @covers SleepingOwl\Admin\Display\TableColumn::setView
     */
    public function test_gets_and_sets_view()
    {
        $column = $this->getColumn();

        $this->assertEquals($column, $column->setView('custom.template'));
        $this->assertEquals('custom.template', $column->getView());
    }

    /**
     * @covers SleepingOwl\Admin\Display\TableColumn::getAppends
     * @covers SleepingOwl\Admin\Display\TableColumn::append
     */
    public function test_gets_and_sets_append()
    {
        $column = $this->getColumn();

        $this->assertNull($column->getAppends());

        $this->assertEquals($column, $column->append($append = m::mock(ColumnInterface::class)));

        $this->assertEquals($append, $column->getAppends());
    }

    /**
     * @covers SleepingOwl\Admin\Display\TableColumn::getModel
     * @covers SleepingOwl\Admin\Display\TableColumn::setModel
     */
    public function test_gets_and_sets_model()
    {
        $column = $this->getColumn();

        $this->assertNull($column->getModel());

        $this->assertEquals($column, $column->setModel($model = new TableColumnTestModel));

        $this->assertEquals($model, $column->getModel());
    }

    /**
     * @covers SleepingOwl\Admin\Display\TableColumn::getModel
     * @covers SleepingOwl\Admin\Display\TableColumn::setModel
     */
    public function test_gets_and_sets_model_with_append()
    {
        $column = $this->getColumn();

        $column->append($append = m::mock(ColumnInterface::class));
        $model = new TableColumnTestModel();
        $append->shouldReceive('setModel')->with($model);
        $column->setModel($model);
        $this->assertEquals($model, $column->getModel());
    }

    /**
     * @covers SleepingOwl\Admin\Display\TableColumn::setOrderable
     * @covers SleepingOwl\Admin\Display\TableColumn::isOrderable
     */
    public function test_setOrderable_closure()
    {
        $this->app->instance(TableHeaderColumnInterface::class, $header = m::mock(TableHeaderColumnInterface::class));
        $column = $this->getColumn();

        $this->assertFalse($column->isOrderable());
        $header->shouldReceive('setOrderable')->with(true);

        $this->assertEquals($column, $column->setOrderable(function () {
        }));
        $this->assertTrue($column->isOrderable());
    }

    /**
     * @covers SleepingOwl\Admin\Display\TableColumn::setOrderable
     * @covers SleepingOwl\Admin\Display\TableColumn::isOrderable
     */
    public function test_setOrderable_string()
    {
        $this->app->instance(TableHeaderColumnInterface::class, $header = m::mock(TableHeaderColumnInterface::class));
        $column = $this->getColumn();

        $this->assertFalse($column->isOrderable());
        $header->shouldReceive('setOrderable')->with(true);

        $column->setOrderable('field_key');
        $this->assertTrue($column->isOrderable());
    }

    /**
     * @covers SleepingOwl\Admin\Display\TableColumn::setOrderable
     * @covers SleepingOwl\Admin\Display\TableColumn::isOrderable
     */
    public function test_setOrderable_class()
    {
        $this->app->instance(TableHeaderColumnInterface::class, $header = m::mock(TableHeaderColumnInterface::class));
        $column = $this->getColumn();

        $this->assertFalse($column->isOrderable());
        $header->shouldReceive('setOrderable')->with(true);

        $column->setOrderable(new TableColumnTestOrderByClause());
        $this->assertTrue($column->isOrderable());
    }

    public function test_setOrderable_true()
    {
        $this->expectException(InvalidArgumentException::class);
        $column = $this->getColumn();
        $column->setOrderable(true);
    }

    public function test_setOrderable_wrong_class()
    {
        $this->expectException(InvalidArgumentException::class);
        $column = $this->getColumn();
        $column->setOrderable(new TableColumnTestModel());
    }

    /**
     * @covers SleepingOwl\Admin\Display\TableColumn::orderBy
     */
    public function test_orderBy()
    {
        $this->app->instance(TableHeaderColumnInterface::class, $header = m::mock(TableHeaderColumnInterface::class));
        $header->shouldReceive('setOrderable')->with(true);

        $column = $this->getColumn();

        $direction = 'asc';
        $builder = m::mock(Illuminate\Database\Eloquent\Builder::class);
        $column->setOrderable($clause = m::mock(TableColumnTestOrderByClause::class));
        $clause->shouldReceive('modifyQuery')->with($builder, $direction);

        $this->assertEquals($column, $column->orderBy($builder, $direction));
    }

    /**
     * @covers SleepingOwl\Admin\Display\TableColumn::toArray
     */
    public function test_toArray()
    {
        $column = $this->getColumn();

        $column->setModel($model = new TableColumnTestModel());
        $column->append($append = m::mock(ColumnInterface::class));

        $column->setHtmlAttribute('class', 'test');

        $this->assertEquals([
            'attributes' => ' class="test"',
            'model' => $model,
            'append' => $append,
        ], $column->toArray());
    }

    public function test_render()
    {
        $column = $this->getColumn();

        $this->getTemplateMock()->shouldReceive('view')->once()->with($column->getView(), $column->toArray())->andReturn('html');
        $this->assertEquals('html', $column->render());
    }

    public function test_columns_has_view()
    {
        $columns = $this->app['sleeping_owl.table.column'];

        foreach ($columns->getAliases() as $class) {
            $column = $this->createMock($class);

            $reflection = new ReflectionClass($class);

            if ($reflection->isAbstract()) {
                continue;
            }

            $property = $reflection->getProperty('view');
            $property->setAccessible(true);

            $this->assertNotNull($property->getValue($column), $class);
        }
    }
}

class TableColumnTestModel extends \Illuminate\Database\Eloquent\Model
{
}

class TableColumnTestOrderByClause implements \SleepingOwl\Admin\Contracts\Display\OrderByClauseInterface
{
    public function setName($name)
    {
    }

    public function modifyQuery(\Illuminate\Database\Eloquent\Builder $query, $direction = 'asc')
    {
    }
}
