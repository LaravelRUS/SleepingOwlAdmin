<?php

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Http\Request;
use Mockery as m;
use SleepingOwl\Admin\Contracts\Repositories\RepositoryInterface;
use SleepingOwl\Admin\Display\DisplayDatatablesAsync;

class DisplayDatatablesAsyncTest extends TestCase
{
    public function test_hidden_info_does_not_request_a_separate_unfiltered_count(): void
    {
        $baseQuery = m::mock(QueryBuilder::class);
        $baseQuery->orders = ['name'];
        $counter = (object) ['count' => 0];
        $query = new CountTrackingBuilder($baseQuery, $counter);

        $repository = m::mock(RepositoryInterface::class);
        $repository->shouldReceive('getQuery')->once()->andReturn($query);

        $display = (new TestableDisplayDatatablesAsync())
            ->setDisplayInfo(false)
            ->setTestRepository($repository);

        $result = $display->renderAsync(Request::create('/', 'GET', ['length' => -1]));

        $this->assertSame(12, $result['recordsTotal']);
        $this->assertSame(12, $result['recordsFiltered']);
        $this->assertSame(1, $counter->count);
    }
}

class TestableDisplayDatatablesAsync extends DisplayDatatablesAsync
{
    public function setTestRepository(RepositoryInterface $repository): self
    {
        $this->repository = $repository;

        return $this;
    }
}

class CountTrackingBuilder extends Builder
{
    private object $counter;

    public function __construct(QueryBuilder $query, object $counter)
    {
        parent::__construct($query);

        $this->counter = $counter;
    }

    public function count($columns = '*'): int
    {
        $this->counter->count++;

        return 12;
    }

    public function get($columns = ['*'])
    {
        return collect();
    }
}
