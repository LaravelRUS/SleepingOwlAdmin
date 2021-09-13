<?php

use Illuminate\Database\Eloquent\Model;
use Mockery as m;
use SleepingOwl\Admin\Repositories\BaseRepository;

class BaseRepositoryTest extends TestCase
{
    public function tearDown(): void
    {
        m::close();
    }

    /**
     * @param  string  $model
     * @return BaseRepository
     *
     * @throws \SleepingOwl\Admin\Exceptions\RepositoryException
     */
    public function getRepository($model = BaseRepositoryTestModel::class)
    {
        $repository = new BaseRepository();
        if (is_object($model)) {
            $repository->setModel($model);
        } else {
            $repository->setClass($model);
        }

        return $repository;
    }

    /**
     * @param  string  $model
     * @return BaseRepository
     *
     * @throws \SleepingOwl\Admin\Exceptions\RepositoryException
     */
    public function getRepositoryWithBuilder($model = BaseRepositoryTestModel::class)
    {
        $model = m::mock($model);
        $builder = m::mock(\Illuminate\Database\Eloquent\Builder::class);

        $builder->shouldReceive('with')->andReturnSelf();
        $model->shouldReceive('query')->andReturn($builder);

        return $this->getRepository(
            $model
        );
    }

    /**
     * @covers SleepingOwl\Admin\Repositories\BaseRepository::getClass
     * @covers SleepingOwl\Admin\Repositories\BaseRepository::getModel
     */
    public function test_constructor()
    {
        $this->assertEquals(BaseRepositoryTestModel::class, $this->getRepository()->getClass());

        $repository = $this->getRepository($model = new BaseRepositoryTestModel());
        $this->assertEquals($model, $repository->getModel());
        $this->assertEquals(get_class($model), $repository->getClass());
    }

    /**
     * @covers SleepingOwl\Admin\Repositories\BaseRepository::getClass
     * @covers SleepingOwl\Admin\Repositories\BaseRepository::setClass
     */
    public function test_gets_and_sets_class()
    {
        $repository = $this->getRepository();
        $this->assertEquals(BaseRepositoryTestModel::class, $repository->getClass());

        $repository->setClass($class = BaseRepositoryTestSecondModel::class);
        $this->assertEquals($class, $repository->getClass());
        $this->assertInstanceOf($class, $repository->getModel());
    }

    public function test_sets_class_exception()
    {
        $this->expectException(SleepingOwl\Admin\Exceptions\RepositoryException::class);
        $repository = $this->getRepository();
        $repository->setClass('BaseRepositoryTestFakeModel');
    }

    /**
     * @covers SleepingOwl\Admin\Repositories\BaseRepository::setModel
     * @covers SleepingOwl\Admin\Repositories\BaseRepository::getModel
     */
    public function test_gets_and_sets_model()
    {
        $repository = $this->getRepository();
        $this->assertInstanceOf(BaseRepositoryTestModel::class, $repository->getModel());

        $repository->setModel($model = new BaseRepositoryTestSecondModel());
        $this->assertEquals($model, $repository->getModel());
        $this->assertEquals(get_class($model), $repository->getClass());
    }

    /**
     * @covers SleepingOwl\Admin\Repositories\BaseRepository::getWith
     * @covers SleepingOwl\Admin\Repositories\BaseRepository::with
     */
    public function test_gets_and_sets_with()
    {
        $repository = $this->getRepository();

        $repository->with('test', 'test1');
        $this->assertEquals(['test', 'test1'], $repository->getWith());

        $repository->with(['test', 'test1']);
        $this->assertEquals(['test', 'test1'], $repository->getWith());
    }

    /**
     * @covers SleepingOwl\Admin\Repositories\BaseRepository::getQuery
     */
    public function test_getQuery()
    {
        $repository = $this->getRepository(
            $model = m::mock(BaseRepositoryTestModel::class)
        );

        $builder = m::mock(\Illuminate\Database\Eloquent\Builder::class);

        $repository->with('test', 'test1');

        $builder->shouldReceive('with')->once()->with(
            ['test', 'test1']
        )->andReturnSelf();

        $model->shouldReceive('query')->once()->andReturn($builder);

        $this->assertEquals($builder, $repository->getQuery());
    }

    /**
     * @covers SleepingOwl\Admin\Repositories\BaseRepository::find
     */
    public function test_find()
    {
        $repository = $this->getRepositoryWithBuilder();

        $builder = $repository->getQuery();
        $builder->shouldNotReceive('withTrashed');
        $builder->shouldReceive('find')->once()->with(1)->andReturn('Model');

        $this->assertEquals('Model', $repository->find(1));
    }

    /**
     * @covers SleepingOwl\Admin\Repositories\BaseRepository::find
     */
    public function test_find_restorable()
    {
        $repository = $this->getRepositoryWithBuilder(BaseRepositoryTestSecondModel::class);

        $builder = $repository->getQuery();
        $builder->shouldReceive('withTrashed')->once();
        $builder->shouldReceive('find')->once()->with(1)->andReturn('Model');

        $this->assertEquals('Model', $repository->find(1));
    }

    /**
     * @covers SleepingOwl\Admin\Repositories\BaseRepository::findOnlyTrashed
     */
    public function test_findOnlyTrashed()
    {
        $repository = $this->getRepositoryWithBuilder();

        $builder = $repository->getQuery();
        $builder->shouldReceive('onlyTrashed')->once()->andReturnSelf();
        $builder->shouldReceive('find')->once()->with(1)->andReturn('Model');

        $this->assertEquals('Model', $repository->findOnlyTrashed(1));
    }

    /**
     * @covers SleepingOwl\Admin\Repositories\BaseRepository::findMany
     */
    public function test_findMany()
    {
        $repository = $this->getRepositoryWithBuilder();

        $repository->getModel()->shouldReceive('getKeyName')->once()->andReturn('id');

        $builder = $repository->getQuery();
        $builder->shouldNotReceive('withTrashed');
        $builder->shouldReceive('whereIn')->once()->with('id', [1, 2, 3])->andReturnSelf();
        $builder->shouldReceive('get')->andReturn($collection = new \Illuminate\Support\Collection());

        $this->assertEquals($collection, $repository->findMany([1, 2, 3]));
    }

    /**
     * @covers SleepingOwl\Admin\Repositories\BaseRepository::findMany
     */
    public function test_findMany_restorable()
    {
        $repository = $this->getRepositoryWithBuilder(BaseRepositoryTestSecondModel::class);

        $repository->getModel()->shouldReceive('getKeyName')->once()->andReturn('id');

        $builder = $repository->getQuery();
        $builder->shouldReceive('withTrashed')->once();
        $builder->shouldReceive('whereIn')->once()->with('id', [1, 2, 3])->andReturnSelf();
        $builder->shouldReceive('get')->andReturn($collection = new \Illuminate\Support\Collection());

        $this->assertEquals($collection, $repository->findMany([1, 2, 3]));
    }

    /**
     * @covers SleepingOwl\Admin\Repositories\BaseRepository::delete
     */
    public function test_delete()
    {
        $repository = $this->getRepositoryWithBuilder();

        $repository->getModel()->shouldReceive('delete')->once();
        $builder = $repository->getQuery();
        $builder->shouldReceive('find')->once()->with(1)->andReturn($repository->getModel());

        $this->assertNull($repository->delete(1));
    }

    /**
     * @covers SleepingOwl\Admin\Repositories\BaseRepository::forceDelete
     */
    public function test_forceDelete()
    {
        $repository = $this->getRepositoryWithBuilder();

        $repository->getModel()->shouldReceive('forceDelete')->once();
        $builder = $repository->getQuery();
        $builder->shouldReceive('onlyTrashed')->once()->andReturnSelf();
        $builder->shouldReceive('find')->once()->with(1)->andReturn($repository->getModel());

        $this->assertNull($repository->forceDelete(1));
    }

    /**
     * @covers SleepingOwl\Admin\Repositories\BaseRepository::restore
     */
    public function test_restore()
    {
        $repository = $this->getRepositoryWithBuilder();

        $repository->getModel()->shouldReceive('restore')->once();
        $builder = $repository->getQuery();
        $builder->shouldReceive('onlyTrashed')->once()->andReturnSelf();
        $builder->shouldReceive('find')->once()->with(1)->andReturn($repository->getModel());

        $this->assertNull($repository->restore(1));
    }

    /**
     * @covers SleepingOwl\Admin\Repositories\BaseRepository::isRestorable
     */
    public function test_isRestorable()
    {
        $repository = $this->getRepositoryWithBuilder();
        $this->assertFalse($repository->isRestorable());

        $repository = $this->getRepositoryWithBuilder(BaseRepositoryTestSecondModel::class);
        $this->assertTrue($repository->isRestorable());
    }
}

class BaseRepositoryTestModel extends Model
{
}

class BaseRepositoryTestSecondModel extends Model
{
    use \Illuminate\Database\Eloquent\SoftDeletes;
}
