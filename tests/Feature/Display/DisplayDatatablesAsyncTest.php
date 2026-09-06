<?php

namespace SleepingOwl\Tests\Feature\Display;

use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use SleepingOwl\Admin\Display\Column\Filter\Text as TextFilter;
use SleepingOwl\Admin\Display\Column\Text;
use SleepingOwl\Admin\Display\DisplayDatatablesAsync;
use SleepingOwl\Admin\Http\Controllers\DisplayController;
use SleepingOwl\Admin\Model\ModelConfiguration;

class DisplayDatatablesAsyncTest extends \TestCase
{
    protected function getEnvironmentSetUp($app)
    {
        parent::getEnvironmentSetUp($app);

        $app['config']->set('database.default', 'testing');
        $app['config']->set('database.connections.testing', [
            'driver' => 'sqlite',
            'database' => ':memory:',
            'prefix' => '',
        ]);
    }

    protected function setUp(): void
    {
        parent::setUp();

        if (! extension_loaded('pdo_sqlite')) {
            $this->markTestSkipped('The async DataTables feature tests require PDO SQLite.');
        }

        $this->createRecordsTable();
        $this->seedRecords();
    }

    public function test_it_returns_paginated_datatables_structure(): void
    {
        $request = $this->bindRequest([
            'draw' => 7,
            'start' => 2,
            'length' => 2,
            'order' => [['column' => 0, 'dir' => 'asc']],
        ]);
        $display = $this->initializeDisplay();

        $result = $display->renderAsync($request);

        $this->assertSame(7, $result['draw']);
        $this->assertSame(6, $result['recordsTotal']);
        $this->assertSame(6, $result['recordsFiltered']);
        $this->assertSame(['3', '4'], $this->columnValues($result, 0));
        $this->assertCount(2, $result['data']);
    }

    public function test_length_minus_one_returns_every_row(): void
    {
        $request = $this->bindRequest([
            'start' => 4,
            'length' => -1,
            'order' => [['column' => 0, 'dir' => 'asc']],
        ]);
        $display = $this->initializeDisplay();

        $result = $display->renderAsync($request);

        $this->assertSame(['1', '2', '3', '4', '5', '6'], $this->columnValues($result, 0));
        $this->assertCount(6, $result['data']);
    }

    public function test_global_search_uses_searchable_columns(): void
    {
        $request = $this->bindRequest([
            'length' => -1,
            'search' => ['value' => 'alp'],
            'order' => [['column' => 0, 'dir' => 'asc']],
        ]);
        $display = $this->initializeDisplay();

        $result = $display->renderAsync($request);

        $this->assertSame(6, $result['recordsTotal']);
        $this->assertSame(2, $result['recordsFiltered']);
        $this->assertSame(['Alpha', 'Alpine'], $this->columnValues($result, 1));
    }

    public function test_ordering_uses_requested_column_and_direction(): void
    {
        $request = $this->bindRequest([
            'length' => 2,
            'order' => [['column' => 3, 'dir' => 'desc']],
        ]);
        $display = $this->initializeDisplay();

        $result = $display->renderAsync($request);

        $this->assertSame(['Foxtrot', 'Echo'], $this->columnValues($result, 1));
        $this->assertSame(['60', '50'], $this->columnValues($result, 3));
    }

    public function test_column_filter_is_applied_to_its_column(): void
    {
        $request = $this->bindRequest([
            'length' => -1,
            'columns' => [
                ['search' => ['value' => '']],
                ['search' => ['value' => 'ta']],
                ['search' => ['value' => '']],
                ['search' => ['value' => '']],
            ],
        ]);
        $filter = (new TextFilter())->setOperator('contains');
        $display = $this->initializeDisplay(function ($display) use ($filter): void {
            $display->setColumnFilters([null, $filter, null, null]);
        });

        $result = $display->renderAsync($request);

        $this->assertSame(1, $result['recordsFiltered']);
        $this->assertSame(['Delta'], $this->columnValues($result, 1));
    }

    public function test_distinct_changes_the_filtered_count_contract(): void
    {
        $request = $this->bindRequest([
            'length' => -1,
            'order' => [['column' => 0, 'dir' => 'asc']],
        ]);
        $display = $this->initializeDisplay(function ($display): void {
            $display->setDistinct('group_code');
        });

        $result = $display->renderAsync($request);

        $this->assertSame(6, $result['recordsTotal']);
        $this->assertSame(3, $result['recordsFiltered']);
        $this->assertCount(6, $result['data']);
    }

    public function test_row_class_is_appended_to_each_rendered_row(): void
    {
        $request = $this->bindRequest([
            'length' => 2,
            'order' => [['column' => 0, 'dir' => 'asc']],
        ]);
        $display = $this->initializeDisplay(function ($display): void {
            $display->setRowClassCallback(function (AsyncDataTableRecord $record) {
                if ($record->status === 'active') {
                    return ['state-active', 'score-'.$record->score];
                }

                return 'state-inactive';
            });
        });

        $result = $display->renderAsync($request);

        $this->assertSame('state-active score-10', $result['data'][0][4]->add_class);
        $this->assertSame('state-inactive', $result['data'][1][4]->add_class);
    }

    public function test_controller_forwards_payload_to_display_configuration(): void
    {
        $receivedPayload = null;
        $createdDisplay = null;
        $configuration = $this->configuration(function (array $payload) use (&$receivedPayload, &$createdDisplay) {
            $receivedPayload = $payload;
            $createdDisplay = $this->newDisplay();
            $createdDisplay->setApply(function (Builder $query) use ($payload): void {
                $query->where('status', $payload['status']);
            });

            return $createdDisplay;
        });
        $request = $this->bindRequest([
            'draw' => 11,
            'length' => -1,
            'payload' => ['status' => 'inactive'],
        ]);

        $result = (new DisplayController())->async($configuration, $request, $this->app, 'records');

        $this->assertSame(['status' => 'inactive'], $receivedPayload);
        $this->assertSame($receivedPayload, $createdDisplay->getPayload());
        $this->assertSame(6, $result['recordsTotal']);
        $this->assertSame(3, $result['recordsFiltered']);
        $this->assertSame(['inactive', 'inactive', 'inactive'], $this->columnValues($result, 2));
    }

    private function initializeDisplay(?Closure $configure = null): DisplayDatatablesAsync
    {
        $display = $this->newDisplay();
        $configure?->__invoke($display);

        return $this->configuration(fn () => $display)->fireDisplay();
    }

    private function configuration(Closure $displayFactory): ModelConfiguration
    {
        $configuration = new ModelConfiguration($this->app, AsyncDataTableRecord::class);
        $configuration->onDisplay($displayFactory);
        $this->app['sleeping_owl']->setModel(AsyncDataTableRecord::class, $configuration);

        return $configuration;
    }

    private function newDisplay(): DisplayDatatablesAsync
    {
        $display = new DisplayDatatablesAsync('records');
        $display->getColumns()->disableControls();
        $display->setColumns([
            (new RawTextColumn('id'))->setSearchable(false),
            new RawTextColumn('name'),
            new RawTextColumn('status'),
            (new RawTextColumn('score'))->setSearchable(false),
        ]);

        return $display;
    }

    private function bindRequest(array $parameters): Request
    {
        $request = Request::create('/admin/records/async/records', 'GET', $parameters);
        $this->app->instance('request', $request);

        return $request;
    }

    private function createRecordsTable(): void
    {
        Schema::create('async_data_table_records', function (Blueprint $table): void {
            $table->increments('id');
            $table->string('name');
            $table->string('status');
            $table->string('group_code');
            $table->unsignedInteger('score');
        });
    }

    private function seedRecords(): void
    {
        AsyncDataTableRecord::query()->insert([
            ['name' => 'Alpha', 'status' => 'active', 'group_code' => 'A', 'score' => 10],
            ['name' => 'Bravo', 'status' => 'inactive', 'group_code' => 'A', 'score' => 40],
            ['name' => 'Alpine', 'status' => 'active', 'group_code' => 'B', 'score' => 30],
            ['name' => 'Delta', 'status' => 'inactive', 'group_code' => 'B', 'score' => 20],
            ['name' => 'Echo', 'status' => 'active', 'group_code' => 'C', 'score' => 50],
            ['name' => 'Foxtrot', 'status' => 'inactive', 'group_code' => 'C', 'score' => 60],
        ]);
    }

    private function columnValues(array $result, int $column): array
    {
        return array_column($result['data'], $column);
    }
}

class RawTextColumn extends Text
{
    public function render()
    {
        return (string) $this->getModelValue();
    }
}

class AsyncDataTableRecord extends Model
{
    public $timestamps = false;

    protected $table = 'async_data_table_records';

    protected $guarded = [];
}
