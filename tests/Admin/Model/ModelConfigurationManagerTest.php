<?php

use KodiComponents\Navigation\Contracts\PageInterface;
use Mockery as m;
use SleepingOwl\Admin\Model\ModelConfigurationManager;

class ModelConfigurationManagerTest extends TestCase
{
    public function tearDown(): void
    {
        m::close();
    }

    /**
     * @param  string  $class
     * @return \PHPUnit\Framework\MockObject\MockObject
     *
     * @throws ReflectionException
     */
    protected function getConfiguration($class = ModelConfigurationManagerTestModel::class)
    {
        return $this->getMockForAbstractClass(ModelConfigurationManager::class, [$this->app, $class]);
    }

    /**
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::__construct
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getClass
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getModel
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getRepository
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getAlias
     */
    public function test_constructor()
    {
        $model = $this->getConfiguration();

        $this->assertEquals(ModelConfigurationManagerTestModel::class, $model->getClass());
        $this->assertInstanceOf(ModelConfigurationManagerTestModel::class, $model->getModel());
        $this->assertInstanceOf(\SleepingOwl\Admin\Contracts\Repositories\RepositoryInterface::class, $model->getRepository());
        $this->assertEquals('model_configuration_manager_test_models', $model->getAlias());
    }

    /**
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getTitle
     */
    public function test_gets_title()
    {
        $model = $this->getConfiguration();
        $this->assertEquals('Model Configuration Manager Test Models', $model->getTitle());
    }

    /**
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getIcon
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::setIcon
     */
    public function test_gets_and_sets_icon()
    {
        $model = $this->getConfiguration();

        $this->assertEquals(
            $model,
            $model->setIcon('fas fa-tachometer-alt')
        );

        $this->assertEquals('fas fa-tachometer-alt', $model->getIcon());
    }

    /**
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getCreateTitle
     */
    public function test_gets_create_title()
    {
        $model = $this->getConfiguration();

        $this->getTranslatorMock()
            ->shouldReceive(version_compare(\Illuminate\Support\Facades\App::version(), '6.0', '>=') ? 'get' : 'trans')
            ->once()
            ->with('sleeping_owl::lang.model.create', ['title' => $model->getTitle()], null)
            ->andReturn('string');

        $this->assertEquals('string', $model->getCreateTitle());
    }

    /**
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getEditTitle
     */
    public function test_gets_edit_title()
    {
        $model = $this->getConfiguration();

        $this->getTranslatorMock()
            ->shouldReceive(version_compare(\Illuminate\Support\Facades\App::version(), '6.0', '>=') ? 'get' : 'trans')
            ->once()
            ->with('sleeping_owl::lang.model.edit', ['title' => $model->getTitle()], null)
            ->andReturn('string');

        $this->assertEquals('string', $model->getEditTitle($model->getModel()));
    }

    /**
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::setEventDispatcher
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::fireEvent
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
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::setEventDispatcher
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::fireEvent
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
        $event->shouldReceive('dispatch')->once()->andReturn(false);

        $return = $model->fireEvent('test', false);
        $this->assertFalse($return);
    }

    public function test_registering_wrong_event()
    {
        $this->expectException(BadMethodCallException::class);
        $model = $this->getConfiguration();
        $model->setEventDispatcher($event = m::mock(\Illuminate\Contracts\Events\Dispatcher::class));

        $model->test(140);
    }

    /**
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::addToNavigation
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
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::can
     */
    public function test_access_checking_disable_access_check()
    {
        $model = $this->getConfiguration();

        $this->app[Illuminate\Contracts\Auth\Access\Gate::class] = $gate = m::mock(\Illuminate\Contracts\Auth\Access\Gate::class);
        $gate->shouldNotReceive('allows');
        $this->assertTrue($model->can('test', $model->getModel()));
    }

    /**
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::enableAccessCheck
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::disableAccessCheck
     */
    public function test_access_checking_enable_access_check()
    {
        $model = $this->getConfiguration();

        $modelObject = $model->getModel();

        $this->assertEquals($model, $model->enableAccessCheck());

        $this->app[Illuminate\Contracts\Auth\Access\Gate::class] = $gate = m::mock(\Illuminate\Contracts\Auth\Access\Gate::class);
        $gate->shouldReceive('allows')->once()->withArgs(['test', [$model, $modelObject]])->andReturn(false);

        $this->assertFalse($model->can('test', $model->getModel()));

        $this->assertEquals($model, $model->disableAccessCheck());
        $this->assertTrue($model->can('test', $model->getModel()));
    }

    /**
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::setControllerClass
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getControllerClass
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::hasCustomControllerClass
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
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getDisplayUrl
     */
    public function test_gets_display_url()
    {
        $model = $this->getConfiguration();

        $val = $this->app['url']->route('admin.model', [$model->getAlias(), 'test'], true);

        $this->assertEquals($val, $model->getDisplayUrl(['test']));
    }

    /**
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getCreateUrl
     */
    public function test_gets_create_url()
    {
        $model = $this->getConfiguration();

        $val = $this->app['url']->route('admin.model.create', [$model->getAlias(), 'test'], true);

        $this->assertEquals($val, $model->getCreateUrl(['test']));
    }

    /**
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getStoreUrl
     */
    public function test_gets_store_url()
    {
        $model = $this->getConfiguration();

        $val = $this->app['url']->route('admin.model.store', [$model->getAlias(), 'locale' => 'en'], true);

        $this->assertEquals($val, $model->getStoreUrl(['locale' => 'en']));
    }

    /**
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getEditUrl
     */
    public function test_gets_edit_url()
    {
        $model = $this->getConfiguration();

        $val = $this->app['url']->route('admin.model.delete', [$model->getAlias(), 1, 'locale' => 'en'], true);

        $this->assertEquals($val, $model->getDeleteUrl(1, ['locale' => 'en']));
    }

    /**
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getUpdateUrl
     */
    public function test_gets_update_url()
    {
        $model = $this->getConfiguration();

        $val = $this->app['url']->route('admin.model.update', [$model->getAlias(), 1, 'locale' => 'en'], true);

        $this->assertEquals($val, $model->getUpdateUrl(1, ['locale' => 'en']));
    }

    /**
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getDeleteUrl
     */
    public function test_gets_delete_url()
    {
        $model = $this->getConfiguration();

        $val = $this->app['url']->route('admin.model.delete', [$model->getAlias(), 1, 'locale' => 'en'], true);

        $this->assertEquals($val, $model->getDeleteUrl(1, ['locale' => 'en']));
    }

    /**
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getDestroyUrl
     */
    public function test_gets_destroy_url()
    {
        $model = $this->getConfiguration();

        $val = $this->app['url']->route('admin.model.destroy', [$model->getAlias(), 1, 'locale' => 'en'], true);

        $this->assertEquals($val, $model->getDestroyUrl(1, ['locale' => 'en']));
    }

    /**
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getRestoreUrl
     */
    public function test_gets_restore_url()
    {
        $model = $this->getConfiguration();

        $val = $this->app['url']->route('admin.model.restore', [$model->getAlias(), 1, 'locale' => 'en'], true);

        $this->assertEquals($val, $model->getRestoreUrl(1, ['locale' => 'en']));
    }

    /**
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getMessageOnCreate
     */
    public function test_gets_message_on_create()
    {
        $model = $this->getConfiguration();

        $this->getTranslatorMock()
            ->shouldReceive(version_compare(\Illuminate\Support\Facades\App::version(), '6.0', '>=') ? 'get' : 'trans')
            ->once()
            ->with('sleeping_owl::lang.message.created', null, null)
            ->andReturn('string');

        $this->assertEquals('string', $model->getMessageOnCreate());
    }

    /**
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getMessageOnUpdate
     */
    public function test_gets_message_on_update()
    {
        $model = $this->getConfiguration();

        $this->getTranslatorMock()
            ->shouldReceive(version_compare(\Illuminate\Support\Facades\App::version(), '6.0', '>=') ? 'get' : 'trans')
            ->once()
            ->with('sleeping_owl::lang.message.updated', null, null)
            ->andReturn('string');

        $this->assertEquals('string', $model->getMessageOnUpdate());
    }

    /**
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getMessageOnDelete
     */
    public function test_gets_message_on_delete()
    {
        $model = $this->getConfiguration();

        $this->getTranslatorMock()
            ->shouldReceive(version_compare(\Illuminate\Support\Facades\App::version(), '6.0', '>=') ? 'get' : 'trans')
            ->once()
            ->with('sleeping_owl::lang.message.deleted', null, null)
            ->andReturn('string');

        $this->assertEquals('string', $model->getMessageOnDelete());
    }

    /**
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getMessageOnRestore
     */
    public function test_gets_message_on_restore()
    {
        $model = $this->getConfiguration();

        $this->getTranslatorMock()
            ->shouldReceive(version_compare(\Illuminate\Support\Facades\App::version(), '6.0', '>=') ? 'get' : 'trans')
            ->once()
            ->with('sleeping_owl::lang.message.restored', null, null)
            ->andReturn('string');

        $this->assertEquals('string', $model->getMessageOnRestore());
    }

    /**
     * @covers SleepingOwl\Admin\Model\ModelConfigurationManager::getMessageOnDestroy
     */
    public function test_gets_message_on_destroy()
    {
        $model = $this->getConfiguration();

        $this->getTranslatorMock()
            ->shouldReceive(version_compare(\Illuminate\Support\Facades\App::version(), '6.0', '>=') ? 'get' : 'trans')
            ->once()
            ->with('sleeping_owl::lang.message.destroyed', null, null)
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
