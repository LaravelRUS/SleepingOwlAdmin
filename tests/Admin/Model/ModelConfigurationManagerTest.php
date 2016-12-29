<?php

use Mockery as m;
use KodiComponents\Navigation\Contracts\PageInterface;
use SleepingOwl\Admin\Model\ModelConfigurationManager;

class ModelConfigurationManagerTest extends TestCase
{
    public function tearDown()
    {
        m::close();
    }

    /**
     * @param string $class
     *
     * @return ModelConfigurationManager|PHPUnit_Framework_MockObject_MockObject
     */
    protected function getConfiguration($class = ModelConfigurationManagerTestModel::class)
    {
        return $this->getMockForAbstractClass(ModelConfigurationManager::class, [$class]);
    }

    /**
     * @covers ModelConfigurationManager::__construct
     * @covers ModelConfigurationManager::getClass
     * @covers ModelConfigurationManager::getModel
     * @covers ModelConfigurationManager::getRepository
     * @covers ModelConfigurationManager::getAlias
     */
    public function test_constructor()
    {
        $model = $this->getConfiguration();

        $this->assertEquals(ModelConfigurationManagerTestModel::class, $model->getClass());
        $this->assertInstanceOf(ModelConfigurationManagerTestModel::class, $model->getModel());
        $this->assertInstanceOf(\SleepingOwl\Admin\Contracts\RepositoryInterface::class, $model->getRepository());
        $this->assertEquals('model_configuration_manager_test_models', $model->getAlias());
    }

    /**
     * @covers ModelConfigurationManager::getTitle
     */
    public function test_gets_title()
    {
        $model = $this->getConfiguration();
        $this->assertEquals('Model Configuration Manager Test Models', $model->getTitle());
    }

    /**
     * @covers ModelConfigurationManager::getIcon
     * @covers ModelConfigurationManager::setIcon
     */
    public function test_gets_and_sets_icon()
    {
        $model = $this->getConfiguration();

        $this->assertEquals(
            $model,
            $model->setIcon('fa fa-test')
        );

        $this->assertEquals('fa fa-test', $model->getIcon());
    }

    /**
     * @covers ModelConfigurationManager::getCreateTitle
     */
    public function test_gets_create_title()
    {
        $model = $this->getConfiguration();

        $this->getTranslatorMock()
            ->shouldReceive('trans')
            ->once()
            ->with('sleeping_owl::lang.model.create', ['title' => $model->getTitle()], 'messages', null)
            ->andReturn('string');

        $this->assertEquals('string', $model->getCreateTitle());
    }

    /**
     * @covers ModelConfigurationManager::getEditTitle
     */
    public function test_gets_edit_title()
    {
        $model = $this->getConfiguration();

        $this->getTranslatorMock()
            ->shouldReceive('trans')
            ->once()
            ->with('sleeping_owl::lang.model.edit', ['title' => $model->getTitle()], 'messages', null)
            ->andReturn('string');

        $this->assertEquals('string', $model->getEditTitle());
    }

    /**
     * @covers ModelConfigurationManager::setEventDispatcher
     * @covers ModelConfigurationManager::fireEvent
     */
    public function test_firing_events_with_halt_default_model()
    {
        $model = $this->getConfiguration();

        $model->setEventDispatcher($event = m::mock(\Illuminate\Contracts\Events\Dispatcher::class));
        $event->shouldReceive('until')->once()->andReturn(true);

        $return = $model->fireEvent('test');
        $this->assertTrue($return);
    }

    /**
     * @covers ModelConfigurationManager::setEventDispatcher
     * @covers ModelConfigurationManager::fireEvent
     */
    public function test_firing_events_with_halt()
    {
        $model = $this->getConfiguration();
        $modelObject = m::mock(ModelConfigurationManagerTestModel::class);

        $model->setEventDispatcher($event = m::mock(\Illuminate\Contracts\Events\Dispatcher::class));
        $event->shouldReceive('until')->once()->andReturnUsing(function ($event, $array) use ($modelObject, $model) {
            $this->assertEquals('sleeping_owl.section.test1: ModelConfigurationManagerTestModel', $event);
            $this->assertEquals($model, $array[0]);
            $this->assertEquals($modelObject, $array[1]);

            return 'hello world';
        });

        $return = $model->fireEvent('test1', true, $modelObject);
        $this->assertEquals('hello world', $return);
    }

    public function test_firing_events_without_halt()
    {
        $model = $this->getConfiguration();

        $model->setEventDispatcher($event = m::mock(\Illuminate\Contracts\Events\Dispatcher::class));
        $event->shouldNotReceive('until');
        $event->shouldReceive('fire')->once()->andReturn(false);

        $return = $model->fireEvent('test', false);
        $this->assertFalse($return);
    }

    public function test_registering_events()
    {
        $model = $this->getConfiguration();
        $model->setEventDispatcher($event = m::mock(\Illuminate\Contracts\Events\Dispatcher::class));

        $events = ['creating', 'created', 'updating', 'updated', 'deleting', 'deleted', 'restoring', 'restored'];
        $event->shouldReceive('listen')->times(count($events));

        foreach ($events as $event) {
            $model->{$event}('test');
        }
    }

    /**
     * @covers ModelConfigurationManager::__call
     */
    public function test_registering_event()
    {
        $model = $this->getConfiguration();
        $model->setEventDispatcher($event = m::mock(\Illuminate\Contracts\Events\Dispatcher::class));

        $callback = 'callback';

        $event->shouldReceive('listen')->once()->withArgs([
            'sleeping_owl.section.creating: ModelConfigurationManagerTestModel',
            $callback,
            140,
        ]);

        $model->creating($callback, 140);
    }

    /**
     * @expectedException BadMethodCallException
     */
    public function test_registering_wrong_event()
    {
        $model = $this->getConfiguration();
        $model->setEventDispatcher($event = m::mock(\Illuminate\Contracts\Events\Dispatcher::class));

        $model->test(140);
    }

    /**
     * @covers ModelConfigurationManager::addToNavigation
     */
    public function test_adds_navigation_page()
    {
        $model = $this->getConfiguration();

        $this->app['sleeping_owl.navigation'] = $navigation = m::mock(\SleepingOwl\Admin\Navigation::class);
        $navigation->shouldReceive('addPage')->once()->andReturnUsing(function ($page) {
            $this->assertInstanceOf(PageInterface::class, $page);
        });

        $this->assertInstanceOf(PageInterface::class, $model->addToNavigation(400));
    }

    /**
     * @covers ModelConfigurationManager::can
     */
    public function test_access_checking_disable_access_check()
    {
        $model = $this->getConfiguration();

        $this->app[Illuminate\Contracts\Auth\Access\Gate::class] = $gate = m::mock(\Illuminate\Contracts\Auth\Access\Gate::class);
        $gate->shouldNotReceive('allows');
        $this->assertTrue($model->can('test', $model->getModel()));
    }

    /**
     * @covers ModelConfigurationManager::enableAccessCheck
     * @covers ModelConfigurationManager::disableAccessCheck
     */
    public function test_access_checking_enable_access_check()
    {
        $model = $this->getConfiguration();

        $modelObject = $model->getModel();

        $this->assertEquals($model, $model->enableAccessCheck());

        $this->app[Illuminate\Contracts\Auth\Access\Gate::class] = $gate = m::mock(\Illuminate\Contracts\Auth\Access\Gate::class);
        $gate->shouldReceive('allows')->once()->withArgs(['test', $modelObject])->andReturn(false);

        $this->assertFalse($model->can('test', $model->getModel()));

        $this->assertEquals($model, $model->disableAccessCheck());
        $this->assertTrue($model->can('test', $model->getModel()));
    }

    /**
     * @covers ModelConfigurationManager::setControllerClass
     * @covers ModelConfigurationManager::getControllerClass
     * @covers ModelConfigurationManager::hasCustomControllerClass
     */
    public function test_gets_and_sets_controller_class()
    {
        $model = $this->getConfiguration();

        $this->assertNull($model->getControllerClass());

        $this->assertEquals($model, $model->setControllerClass('test'));

        $this->assertEquals('test', $model->getControllerClass());
        $this->assertFalse($model->hasCustomControllerClass());

        $model->setControllerClass(ModelConfigurationManagerTestController::class);
        $this->assertEquals(ModelConfigurationManagerTestController::class, $model->getControllerClass());
        $this->assertTrue($model->hasCustomControllerClass());
    }

    /**
     * @covers ModelConfigurationManager::getDisplayUrl
     */
    public function test_gets_display_url()
    {
        $model = $this->getConfiguration();

        $this->getRouterMock()->shouldReceive('route')->once()->withArgs([
            'admin.model',
            [$model->getAlias(), 'test'],
            true,
        ])->andReturn('http://site.com');

        $this->assertEquals('http://site.com', $model->getDisplayUrl(['test']));
    }

    /**
     * @covers ModelConfigurationManager::getCreateUrl
     */
    public function test_gets_create_url()
    {
        $model = $this->getConfiguration();

        $this->getRouterMock()->shouldReceive('route')->once()->withArgs([
            'admin.model.create',
            [$model->getAlias(), 'test'],
            true,
        ])->andReturn('http://site.com');

        $this->assertEquals('http://site.com', $model->getCreateUrl(['test']));
    }

    /**
     * @covers ModelConfigurationManager::getStoreUrl
     */
    public function test_gets_store_url()
    {
        $model = $this->getConfiguration();

        $this->getRouterMock()->shouldReceive('route')->once()->withArgs([
            'admin.model.store',
            $model->getAlias(),
            true,
        ])->andReturn('http://site.com');

        $this->assertEquals('http://site.com', $model->getStoreUrl());
    }

    /**
     * @covers ModelConfigurationManager::getEditUrl
     */
    public function test_gets_edit_url()
    {
        $model = $this->getConfiguration();

        $this->getRouterMock()->shouldReceive('route')->once()->withArgs([
            'admin.model.edit',
            [$model->getAlias(), 1],
            true,
        ])->andReturn('http://site.com');

        $this->assertEquals('http://site.com', $model->getEditUrl(1));
    }

    /**
     * @covers ModelConfigurationManager::getUpdateUrl
     */
    public function test_gets_update_url()
    {
        $model = $this->getConfiguration();

        $this->getRouterMock()->shouldReceive('route')->once()->withArgs([
            'admin.model.update',
            [$model->getAlias(), 1],
            true,
        ])->andReturn('http://site.com');

        $this->assertEquals('http://site.com', $model->getUpdateUrl(1));
    }

    /**
     * @covers ModelConfigurationManager::getDeleteUrl
     */
    public function test_gets_delete_url()
    {
        $model = $this->getConfiguration();

        $this->getRouterMock()->shouldReceive('route')->once()->withArgs([
            'admin.model.delete',
            [$model->getAlias(), 1],
            true,
        ])->andReturn('http://site.com');

        $this->assertEquals('http://site.com', $model->getDeleteUrl(1));
    }

    /**
     * @covers ModelConfigurationManager::getDestroyUrl
     */
    public function test_gets_destroy_url()
    {
        $model = $this->getConfiguration();

        $this->getRouterMock()->shouldReceive('route')->once()->withArgs([
            'admin.model.destroy',
            [$model->getAlias(), 1],
            true,
        ])->andReturn('http://site.com');

        $this->assertEquals('http://site.com', $model->getDestroyUrl(1));
    }

    /**
     * @covers ModelConfigurationManager::getRestoreUrl
     */
    public function test_gets_restore_url()
    {
        $model = $this->getConfiguration();

        $this->getRouterMock()->shouldReceive('route')->once()->withArgs([
            'admin.model.restore',
            [$model->getAlias(), 1],
            true,
        ])->andReturn('http://site.com');

        $this->assertEquals('http://site.com', $model->getRestoreUrl(1));
    }

    /**
     * @covers ModelConfigurationManager::getMessageOnCreate
     */
    public function test_gets_message_on_create()
    {
        $model = $this->getConfiguration();

        $this->getTranslatorMock()
            ->shouldReceive('trans')
            ->once()
            ->with('sleeping_owl::lang.message.created', null, 'messages', null)
            ->andReturn('string');

        $this->assertEquals('string', $model->getMessageOnCreate());
    }

    /**
     * @covers ModelConfigurationManager::getMessageOnUpdate
     */
    public function test_gets_message_on_update()
    {
        $model = $this->getConfiguration();

        $this->getTranslatorMock()
            ->shouldReceive('trans')
            ->once()
            ->with('sleeping_owl::lang.message.updated', null, 'messages', null)
            ->andReturn('string');

        $this->assertEquals('string', $model->getMessageOnUpdate());
    }

    /**
     * @covers ModelConfigurationManager::getMessageOnDelete
     */
    public function test_gets_message_on_delete()
    {
        $model = $this->getConfiguration();

        $this->getTranslatorMock()
            ->shouldReceive('trans')
            ->once()
            ->with('sleeping_owl::lang.message.deleted', null, 'messages', null)
            ->andReturn('string');

        $this->assertEquals('string', $model->getMessageOnDelete());
    }

    /**
     * @covers ModelConfigurationManager::getMessageOnRestore
     */
    public function test_gets_message_on_restore()
    {
        $model = $this->getConfiguration();

        $this->getTranslatorMock()
            ->shouldReceive('trans')
            ->once()
            ->with('sleeping_owl::lang.message.restored', null, 'messages', null)
            ->andReturn('string');

        $this->assertEquals('string', $model->getMessageOnRestore());
    }

    /**
     * @covers ModelConfigurationManager::getMessageOnDestroy
     */
    public function test_gets_message_on_destroy()
    {
        $model = $this->getConfiguration();

        $this->getTranslatorMock()
            ->shouldReceive('trans')
            ->once()
            ->with('sleeping_owl::lang.message.destroyed', null, 'messages', null)
            ->andReturn('string');

        $this->assertEquals('string', $model->getMessageOnDestroy());
    }
}

class ModelConfigurationManagerTestModel extends \Illuminate\Database\Eloquent\Model
{
}

class ModelConfigurationManagerTestController
{
}
