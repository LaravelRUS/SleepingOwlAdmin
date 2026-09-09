<?php

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Database\Query\Grammars\PostgresGrammar;
use Mockery as m;
use SleepingOwl\Admin\Traits\SqlQueryOperators;

class SqlQueryOperatorsTest extends TestCase
{
    public function test_it_uses_the_model_query_grammar_for_postgres_text_filters(): void
    {
        config()->set('sleeping_owl.postgres_search_operator', 'ilike');
        config()->set('sleeping_owl.search_operator', 'like');

        $baseQuery = m::mock(QueryBuilder::class);
        $baseQuery->shouldReceive('getGrammar')
            ->once()
            ->andReturn(m::mock(PostgresGrammar::class));

        $query = m::mock(Builder::class);
        $query->shouldReceive('getQuery')
            ->once()
            ->andReturn($baseQuery);
        $query->shouldReceive('where')
            ->once()
            ->with('name', 'ilike', '%Daan%');

        (new SqlQueryOperatorsProbe())->applyContains($query, 'name', 'Daan');
    }
}

final class SqlQueryOperatorsProbe
{
    use SqlQueryOperators;

    public function applyContains(Builder $query, string $column, string $value): void
    {
        $this->operator = 'contains';

        $this->buildQuery($query, $column, $value);
    }
}
