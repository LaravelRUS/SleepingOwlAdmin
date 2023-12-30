<?php

use Illuminate\Database\Eloquent\Model;
use Mockery as m;
use SleepingOwl\Admin\Display\Column\NamedColumn;

class NamedColumnTest extends TestCase
{
    use \SleepingOwl\Tests\AssetsTesterTrait;

    public function tearDown(): void
    {
        m::close();
    }

    /**
     * @param  string  $name
     * @param  string  $label
     * @return \PHPUnit\Framework\MockObject\MockObject
     *
     * @throws ReflectionException
     */
    protected function getColumn($name = 'test_name', $label = 'Test Label')
    {
        return $this->getMockForAbstractClass(NamedColumn::class, [$name, $label]);
    }

    public function test_constructor()
    {
        $this->packageIncluded();
        $column = $this->getColumn();

        $this->assertEquals('test_name', $column->getName());
        $this->assertEquals('row-'.strtolower(class_basename($column)), $column->getHtmlAttribute('class'));
        $this->assertTrue($column->isOrderable());
    }

    public function test_gets_or_sets_name()
    {
        $column = $this->getColumn();

        $column->setName('test');
        $this->assertEquals('test', $column->getName());
    }

    public function test_gets_model_value()
    {
        $column = $this->getColumn($name = 'column_key');

        $column->setModel($model = m::mock(Model::class));

        $model->shouldReceive('getAttribute')->once()->with($name)->andReturn('value');
        $this->assertEquals('value', $column->getModelValue());
    }

    public function test_gets_model_value_many_relation()
    {
        $column = $this->getColumn($name = 'column.key');

        $column->setModel($model = m::mock(Model::class));

        $collection = m::mock(\Illuminate\Database\Eloquent\Collection::class);
        $collection->shouldReceive('pluck')->once()->with('key')->andReturn($expected = ['value']);
        $model->shouldReceive('getAttribute')->once()->with('column')->andReturn($collection);

        $this->assertEquals($expected, $column->getModelValue());
    }

    public function test_gets_model_value_one_relation()
    {
        $column = $this->getColumn($name = 'column.key');

        $column->setModel($model = m::mock(Model::class));

        $model->shouldReceive('getAttribute')->once()->with('column')->andReturn($model = m::mock(Model::class));
        $model->shouldReceive('getAttribute')->once()->with('key')->andReturn($expected = 'value');

        $this->assertEquals($expected, $column->getModelValue());
    }

    public function test_sets_orderable_true()
    {
        $column = $this->getColumn($name = 'column.key');

        $this->assertEquals($column, $column->setOrderable(true));

        $clause = $column->getOrderByClause();
        $this->assertInstanceOf(\SleepingOwl\Admin\Contracts\Display\OrderByClauseInterface::class, $clause);

        $reflection = new ReflectionClass($clause);
        $property = $reflection->getProperty('name');
        $property->setAccessible(true);

        $this->assertEquals($name, $property->getValue($clause));
        $this->assertTrue($column->isOrderable());
    }

    public function test_sets_orderable_false()
    {
        $column = $this->getColumn($name = 'column.key');

        $this->assertEquals($column, $column->setOrderable(false));
        $this->assertFalse($column->isOrderable());
        $this->assertNotInstanceOf(\SleepingOwl\Admin\Contracts\Display\OrderByClauseInterface::class, $column->getOrderByClause());
    }

    public function test_sets_orderable_string()
    {
        $column = $this->getColumn($name = 'column.key');

        $this->assertEquals($column, $column->setOrderable('column.key2'));

        $clause = $column->getOrderByClause();
        $this->assertInstanceOf(\SleepingOwl\Admin\Contracts\Display\OrderByClauseInterface::class, $clause);

        $reflection = new ReflectionClass($clause);
        $property = $reflection->getProperty('name');
        $property->setAccessible(true);

        $this->assertEquals('column.key2', $property->getValue($clause));
        $this->assertTrue($column->isOrderable());
    }

    public function test_sets_orderable_class()
    {
        $column = $this->getColumn();

        $this->assertEquals($column, $column->setOrderable(new NamedColumnTestOrderByClause()));
        $this->assertInstanceOf(\SleepingOwl\Admin\Contracts\Display\OrderByClauseInterface::class, $column->getOrderByClause());
    }
}

class NamedColumnTestOrderByClause implements \SleepingOwl\Admin\Contracts\Display\OrderByClauseInterface
{
    public function setName($name)
    {
    }

    public function modifyQuery(\Illuminate\Database\Eloquent\Builder $query, $direction = 'asc')
    {
    }
}
