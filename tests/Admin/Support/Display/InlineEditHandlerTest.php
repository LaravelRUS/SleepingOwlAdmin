<?php

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Mockery as m;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\Repositories\RepositoryInterface;
use SleepingOwl\Admin\Display\Column\Editable\Text;
use SleepingOwl\Admin\Display\DisplayTable;
use SleepingOwl\Admin\Support\Display\EditableColumnResolver;
use SleepingOwl\Admin\Support\Display\InlineEditHandler;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class InlineEditHandlerTest extends TestCase
{
    public function test_it_stops_when_the_updating_event_rejects_the_change(): void
    {
        $column = new InlineEditHandlerTestColumn('status');
        $item = new InlineEditHandlerTestModel;
        $request = $this->request('status', 7, 'published');
        $repository = $this->repositoryReturning($item);
        $model = $this->configuration($column, $repository, true);
        $model->shouldReceive('fireEvent')->once()
            ->with('updating', true, $item, $request)->andReturnFalse();

        $result = $this->handler()->handle($model, $request);

        $this->assertSame([
            'status' => false,
            'reason' => 'Can not fire event: updating',
        ], $result);
        $this->assertFalse($column->saved);
    }

    public function test_it_returns_the_value_rendered_by_the_column(): void
    {
        $column = new InlineEditHandlerTestColumn('status', 'Published');
        $item = new InlineEditHandlerTestModel;
        $request = $this->request('status', 7, 'published');
        $model = $this->configuration($column, $this->repositoryReturning($item), true);
        $model->shouldReceive('fireEvent')->once()
            ->with('updating', true, $item, $request)->andReturnTrue();
        $model->shouldReceive('fireEvent')->once()
            ->with('updated', false, $item, $request);

        $this->assertSame([
            'status' => true,
            'name' => 'status',
            'newValue' => 'Published',
            'pk' => 7,
        ], $this->handler()->handle($model, $request));
    }

    public function test_it_reads_a_nested_value_after_the_column_saves(): void
    {
        $column = new InlineEditHandlerTestColumn('profile.status');
        $item = new InlineEditHandlerTestModel;
        $stored = new InlineEditHandlerTestModel;
        $stored->setRelation('profile', new InlineEditHandlerTestModel(['status' => 'Published']));
        $repository = m::mock(RepositoryInterface::class);
        $repository->shouldReceive('find')->twice()->with(7)->andReturn($item, $stored);
        $request = $this->request('profile.status', 7, 'published');
        $model = $this->configuration($column, $repository, true);
        $model->shouldReceive('fireEvent')->once()->andReturnTrue();
        $model->shouldReceive('fireEvent')->once();

        $result = $this->handler()->handle($model, $request);

        $this->assertSame('status', $result['name']);
        $this->assertSame('Published', $result['newValue']);
    }

    public function test_it_hides_a_missing_model(): void
    {
        $column = new InlineEditHandlerTestColumn('status');
        $request = $this->request('status', 7, 'published');
        $repository = m::mock(RepositoryInterface::class);
        $repository->shouldReceive('find')->once()->with(7)->andReturnNull();
        $model = $this->configuration($column, $repository, null);

        $this->expectException(NotFoundHttpException::class);

        $this->handler()->handle($model, $request);
    }

    public function test_it_hides_a_non_editable_model(): void
    {
        $column = new InlineEditHandlerTestColumn('status');
        $request = $this->request('status', 7, 'published');
        $repository = $this->repositoryReturning(new InlineEditHandlerTestModel);
        $model = $this->configuration($column, $repository, false);

        $this->expectException(NotFoundHttpException::class);

        $this->handler()->handle($model, $request);
    }

    private function configuration(
        InlineEditHandlerTestColumn $column,
        RepositoryInterface $repository,
        ?bool $editable
    ): ModelConfigurationInterface {
        $model = m::mock(ModelConfigurationInterface::class);
        $model->shouldReceive('fireDisplay')->once()->andReturn(
            (new DisplayTable)->setColumns([$column])
        );
        $model->shouldReceive('getRepository')->andReturn($repository);
        if ($editable !== null) {
            $model->shouldReceive('isEditable')->once()->andReturn($editable);
        }

        return $model;
    }

    private function repositoryReturning(Model $model): RepositoryInterface
    {
        $repository = m::mock(RepositoryInterface::class);
        $repository->shouldReceive('find')->once()->with(7)->andReturn($model);

        return $repository;
    }

    private function request(string $name, int $id, $value): Request
    {
        return Request::create('/', 'POST', ['name' => $name, 'pk' => $id, 'value' => $value]);
    }

    private function handler(): InlineEditHandler
    {
        return new InlineEditHandler(new EditableColumnResolver);
    }
}

class InlineEditHandlerTestColumn extends Text
{
    public bool $saved = false;

    public function __construct(string $name, private $returnValue = null)
    {
        parent::__construct($name);
    }

    public function save(Request $request)
    {
        $this->saved = true;

        return $this->returnValue;
    }
}

class InlineEditHandlerTestModel extends Model
{
    protected $guarded = [];
}
