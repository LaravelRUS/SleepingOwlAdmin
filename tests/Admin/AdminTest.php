<?php

use KodiComponents\Navigation\Contracts\PageInterface;
use Mockery as m;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;

class AdminTest extends TestCase
{
    /**
     * @var SleepingOwl\Admin\Admin
     */
    private $admin;

    public function tearDown(): void
    {
        m::close();
    }

    public function setUp(): void
    {
        parent::setUp();

        $this->admin = new SleepingOwl\Admin\Admin($this->app);

        $this->admin->setTemplate(m::mock(TemplateInterface::class));
    }

    /**
     * @covers SleepingOwl\Admin\Admin::registerModel
     * @covers SleepingOwl\Admin\Admin::getModels
     */
    public function test_registers_models()
    {
        $this->admin->registerModel(TestModel::class, function () {
        });
        $this->assertCount(1, $this->admin->getModels());

        $this->admin->registerModel(TestModel::class, function () {
        });
        $this->assertCount(1, $this->admin->getModels());

        $this->admin->registerModel(OtherTestModel::class, function () {
        });
        $this->assertCount(2, $this->admin->getModels());
    }

    /**
     * @covers SleepingOwl\Admin\Admin::register
     * @covers SleepingOwl\Admin\Admin::getModels
     */
    public function test_register_configuration()
    {
        $configuration = $this->createMock(\SleepingOwl\Admin\Contracts\ModelConfigurationInterface::class);
        $configuration->expects($this->once())->method('getClass')->will($this->returnValue(TestModel::class));

        $this->admin->register($configuration);

        $configuration1 = $this->createMock(TestModelConfiguration::class);
        $configuration1->expects($this->once())->method('getClass')->will($this->returnValue(OtherTestModel::class));
        $configuration1->expects($this->once())->method('initialize');

        $this->admin->register($configuration1);

        $configuration2 = $this->createMock(TestModelConfiguration::class);
        $configuration2->expects($this->once())->method('getClass')->will($this->returnValue(TestModel::class));
        $this->admin->register($configuration2);

        $this->assertCount(2, $this->admin->getModels());
    }

    /**
     * @covers SleepingOwl\Admin\Admin::getModel
     */
    public function test_gets_model()
    {
        $configuration = $this->createMock(\SleepingOwl\Admin\Contracts\ModelConfigurationInterface::class);
        $configuration->expects($this->once())->method('getClass')->will($this->returnValue(TestModel::class));

        $this->admin->register($configuration);

        $model = $this->admin->getModel(TestModel::class);
        $this->assertEquals($configuration, $model);

        $model = $this->admin->getModel(new TestModel());
        $this->assertEquals($configuration, $model);

        $model = $this->admin->getModel(OtherTestModel::class);

        $this->assertInstanceOf(
            \SleepingOwl\Admin\Contracts\ModelConfigurationInterface::class,
            $model
        );
    }

    /**
     * @covers SleepingOwl\Admin\Admin::setModel
     */
    public function test_set_model()
    {
        $configuration = $this->createMock(\SleepingOwl\Admin\Contracts\ModelConfigurationInterface::class);

        $this->admin->setModel(TestClass::class, $configuration);
        $this->assertCount(1, $this->admin->getModels());
    }

    /**
     * @covers SleepingOwl\Admin\Admin::hasModel
     */
    public function test_checks_if_has_model()
    {
        $this->admin->registerModel(TestModel::class, function () {
        });
        $this->assertTrue($this->admin->hasModel(TestModel::class));
        $this->assertFalse($this->admin->hasModel(OtherTestModel::class));
    }

    /**
     * @covers SleepingOwl\Admin\Admin::template
     */
    public function test_returns_template()
    {
        $this->assertInstanceOf(
            TemplateInterface::class,
            $this->admin->template()
        );
    }

    /**
     * @covers SleepingOwl\Admin\Admin::addMenuPage
     */
    public function test_adds_menu_page()
    {
        $navigation = m::mock(\SleepingOwl\Admin\Navigation::class);
        $this->app->instance('sleeping_owl.navigation', $navigation);
        $navigation->shouldReceive('addPage')->once();

        $this->assertInstanceOf(PageInterface::class, $this->admin->addMenuPage(TestModel::class));
    }

    /**
     * @covers SleepingOwl\Admin\Admin::view
     */
    public function test_renders_view()
    {
        $arguments = ['content', 'title'];
        $viewClass = \Illuminate\View\View::class;
        $controllerClass = \SleepingOwl\Admin\Http\Controllers\AdminController::class;

        $controller = m::mock($controllerClass);
        $this->app->instance($controllerClass, $controller);
        $view = m::mock($viewClass);

        $controller->shouldReceive('renderContent')
            ->withArgs($arguments)
            ->once()
            ->andReturn($view);

        $this->assertEquals(
            $view,
            $this->admin->view($arguments[0], $arguments[1])
        );
    }
}

class TestModel extends \Illuminate\Database\Eloquent\Model
{
}

class OtherTestModel extends \Illuminate\Database\Eloquent\Model
{
}

abstract class TestModelConfiguration implements \SleepingOwl\Admin\Contracts\ModelConfigurationInterface, \SleepingOwl\Admin\Contracts\Initializable
{
}
