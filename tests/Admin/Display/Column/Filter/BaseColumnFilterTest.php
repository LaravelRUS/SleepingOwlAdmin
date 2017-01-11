<?php

use Mockery as m;
use SleepingOwl\Admin\Display\Column\Filter\BaseColumnFilter;

class BaseColumnFilterTest extends TestCase
{
    public function tearDown()
    {
        m::close();
    }

    /**
     * @param string $operator
     *
     * @return BaseColumnFilter
     */
    public function getFilter($operator = 'equal')
    {
        $filter = $this->getMockForAbstractClass(BaseColumnFilter::class);

        $filter->setOperator($operator);

        return $filter;
    }

    /**
     * @dataProvider sqlOperatorsProvider
     */
    public function testApply($operator, $condition, $args)
    {
        $filter = $this->getFilter();

        $filter->setOperator($operator);

        $column = m::mock(\SleepingOwl\Admin\Contracts\NamedColumnInterface::class);
        $column->shouldReceive('getName')->andReturn('columnName');

        $builder = m::mock(\Illuminate\Database\Eloquent\Builder::class);
        $builder->shouldReceive($condition)->withArgs($args);

        $filter->apply($column, $builder, 'keyword', []);
    }

    /**
     * @dataProvider sqlOperatorsProvider
     */
    public function testApplyRelated($operator, $condition, $args)
    {
        $filter = $this->getFilter();

        $filter->setOperator($operator);

        $column = m::mock(\SleepingOwl\Admin\Contracts\NamedColumnInterface::class);
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

    public function sqlOperatorsProvider()
    {
        return [
            'equal' => ['equal', 'where', ['columnName', '=', 'keyword']],
            'not_equal' => ['not_equal', 'where', ['columnName', '!=', 'keyword']],
            'less' => ['less', 'where', ['columnName', '<', 'keyword']],
            'less_or_equal' => ['less_or_equal', 'where', ['columnName', '<=', 'keyword']],
            'greater' => ['greater', 'where', ['columnName', '>', 'keyword']],
            'greater_or_equal'=> ['greater_or_equal', 'where', ['columnName', '>=', 'keyword']],
            'begins_with'=> ['begins_with', 'where', ['columnName', 'like', 'keyword%']],
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
