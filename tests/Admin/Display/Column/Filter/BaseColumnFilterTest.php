<?php

use Mockery as m;
use PHPUnit\Framework\Attributes\DataProvider;
use SleepingOwl\Admin\Contracts\Display\ColumnInterface;
use SleepingOwl\Admin\Display\Column\Filter\BaseColumnFilter;

class ConcreteBaseColumnFilter extends BaseColumnFilter
{
}

class BaseColumnFilterTest extends TestCase
{
    /**
     * @param  string  $operator
     * @return \PHPUnit\Framework\MockObject\MockObject
     *
     * @throws ReflectionException
     */
    public function getFilter($operator = 'equal')
    {
        $filter = new ConcreteBaseColumnFilter();

        $filter->setOperator($operator);

        return $filter;
    }

    /**
     * @param  $operator
     * @param  $condition
     * @param  $args
     *
     * @throws ReflectionException
     *
     * @dataProvider sqlOperatorsProvider
     *
     * @doesNotPerformAssertions
     */
    #[DataProvider('sqlOperatorsProvider')]
    public function testApply($operator, $condition, $args)
    {
        $filter = $this->getFilter();

        $filter->setOperator($operator);

        $column = m::mock(ColumnInterface::class);
        $column->shouldReceive('getMetaData')->once()->andReturn(null);
        $column->shouldReceive('getFilterCallback')->once()->andReturn(null);
        $column->shouldReceive('getName')->andReturn('columnName');

        $builder = m::mock(\Illuminate\Database\Eloquent\Builder::class);
        $builder->shouldReceive($condition)->withArgs($args);

        $filter->apply($column, $builder, 'keyword', []);
    }

    /**
     * @dataProvider sqlOperatorsProvider
     */
    #[DataProvider('sqlOperatorsProvider')]
    public function testApplyRelated($operator, $condition, $args)
    {
        $filter = $this->getFilter();

        $filter->setOperator($operator);

        $column = m::mock(ColumnInterface::class);
        $column->shouldReceive('getMetaData')->once()->andReturn(null);
        $column->shouldReceive('getFilterCallback')->once()->andReturn(null);
        $column->shouldReceive('getName')->andReturn('column.test.columnName');

        $builder = m::mock(\Illuminate\Database\Eloquent\Builder::class);
        $subBuilder = m::mock(\Illuminate\Database\Eloquent\Builder::class);
        $subBuilder->shouldReceive($condition)->withArgs($args);

        $builder->shouldReceive('whereHas')->andReturnUsing(function ($relation, $callback) use ($subBuilder) {
            $this->assertEquals('column.test', $relation);
            $callback($subBuilder);
        });

        $filter->apply($column, $builder, 'keyword', []);
    }

    /**
     * The literal zero is a selectable filter value (`0 => 'No'`), not "nothing selected".
     */
    public function testApplyKeepsZeroValue()
    {
        $column = m::mock(ColumnInterface::class);
        $column->shouldReceive('getMetaData')->once()->andReturn(null);
        $column->shouldReceive('getFilterCallback')->once()->andReturn(null);
        $column->shouldReceive('getName')->andReturn('columnName');

        $builder = m::mock(\Illuminate\Database\Eloquent\Builder::class);
        $builder->shouldReceive('where')->once()->withArgs(['columnName', '=', '0']);

        $this->getPlainFilter()->apply($column, $builder, '0', []);
    }

    /**
     * @param  mixed  $value
     */
    #[DataProvider('emptyValuesProvider')]
    public function testApplySkipsEmptyValue($value)
    {
        $column = m::mock(ColumnInterface::class);
        $column->shouldReceive('getMetaData')->once()->andReturn(null);
        $column->shouldReceive('getFilterCallback')->once()->andReturn(null);
        $column->shouldReceive('getName')->andReturn('columnName');

        $builder = m::mock(\Illuminate\Database\Eloquent\Builder::class);
        $builder->shouldNotReceive('where');

        $this->getPlainFilter()->apply($column, $builder, $value, []);
    }

    public static function emptyValuesProvider()
    {
        return [
            'null' => [null],
            'empty string' => [''],
            'empty array' => [[]],
            'false' => [false],
        ];
    }

    /**
     * A bare filter with the default `equal` operator, without the asset package
     * initialization the constructor does — `apply()` does not need it.
     *
     * @return BaseColumnFilter
     */
    protected function getPlainFilter()
    {
        return new class extends BaseColumnFilter
        {
            public function __construct()
            {
            }
        };
    }

    public static function sqlOperatorsProvider()
    {
        return [
            'equal' => ['equal', 'where', ['columnName', '=', 'keyword']],
            'not_equal' => ['not_equal', 'where', ['columnName', '!=', 'keyword']],
            'less' => ['less', 'where', ['columnName', '<', 'keyword']],
            'less_or_equal' => ['less_or_equal', 'where', ['columnName', '<=', 'keyword']],
            'greater' => ['greater', 'where', ['columnName', '>', 'keyword']],
            'greater_or_equal' => ['greater_or_equal', 'where', ['columnName', '>=', 'keyword']],
            'begins_with' => ['begins_with', 'where', ['columnName', 'like', 'keyword%']],
            'not_begins_with' => ['not_begins_with', 'where', ['columnName', 'not like', 'keyword%']],
            'contains' => ['contains', 'where', ['columnName', 'like', '%keyword%']],
            'not_contains' => ['not_contains', 'where', ['columnName', 'not like', '%keyword%']],
            'ends_with' => ['ends_with', 'where', ['columnName', 'like', '%keyword']],
            'not_ends_with' => ['not_ends_with', 'where', ['columnName', 'not like', '%keyword']],
            'is_empty' => ['is_empty', 'where', ['columnName', '=', '']],
            'is_not_empty' => ['is_not_empty', 'where', ['columnName', '!=', '']],
            'is_null' => ['is_null', 'whereNull', ['columnName']],
            'is_not_null' => ['is_not_null', 'whereNotNull', ['columnName']],
            'between' => ['between', 'whereBetween', ['columnName', ['keyword']]],
            'not_between' => ['not_between', 'whereNotBetween', ['columnName', ['keyword']]],
            'in' => ['in', 'whereIn', ['columnName', ['keyword']]],
            'not_in' => ['not_in', 'whereNotIn', ['columnName', ['keyword']]],
        ];
    }
}
