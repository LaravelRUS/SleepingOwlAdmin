<?php

use Mockery as m;
use SleepingOwl\Admin\Form\FormDefault;
use SleepingOwl\Admin\Contracts\Form\FormButtonsInterface;
use SleepingOwl\Admin\Contracts\Form\FormElementInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\Repositories\RepositoryInterface;

class FormDefaultTest extends TestCase
{
    use \SleepingOwl\Tests\AssetsTesterTrait;

    public function tearDown()
    {
        m::close();
    }

    public function getFormElement(array $elements = [])
    {
        return new FormDefault($elements);
    }

    /**
     * FormDefault::__construct
     * FormDefault::getElements
     * FormDefault::getButtons.
     */
    public function test_constructor()
    {
        $this->packageIncluded();

        $form = $this->getFormElement([
            m::mock(FormElementInterface::class),
        ]);

        $this->assertCount(1, $form->getElements());
    }

    /**
     * @covers FormDefault::initialize
     * @covers FormDefault::getRepository
     */
    public function test_initialize()
    {
        $this->packageInitialized();

        $this->app->instance(
            RepositoryInterface::class,
            $repository = m::mock(RepositoryInterface::class)
        );

        $repository->shouldReceive('setClass')->once();

        $class = FormDefaultTestMockModel::class;

        $this->app->instance(
            FormButtonsInterface::class,
            $buttons = m::mock(FormButtonsInterface::class)
        );

        $this->getSleepingOwlMock()->shouldReceive('getModel')
            ->once()
            ->with($class)
            ->andReturn(m::mock(ModelConfigurationInterface::class));

        $buttons->shouldReceive('setModel')->once();
        $buttons->shouldReceive('setModelConfiguration')->once();

        $form = $this->getFormElement([
            $element = m::mock(FormElementInterface::class),
            $uploadElement = m::mock(\SleepingOwl\Admin\Form\Element\Upload::class),
        ]);

        $element->shouldReceive('setModel')->once();
        $element->shouldReceive('initialize')->once();

        $uploadElement->shouldReceive('setModel')->once();
        $uploadElement->shouldReceive('initialize')->once();

        $this->assertFalse($form->hasHtmlAttribute('enctype'));
        $form->setAction('action');

        $form->setModelClass($class);
        $form->initialize();

        $this->assertEquals('multipart/form-data', $form->getHtmlAttribute('enctype'));

        //$this->assertEquals('POST', $form->getHtmlAttribute('method'));
        //$this->assertEquals('action', $form->getHtmlAttribute('action'));

        $this->assertEquals($repository, $form->getRepository());
    }

    /**
     * @covers FormDefault::getButtons
     * @covers FormDefault::setButtons
     */
    public function test_gets_and_sets_buttons()
    {
        $form = $this->getFormElement();

        $this->assertInstanceOf(FormButtonsInterface::class, $form->getButtons());

        $this->assertEquals(
            $form,
            $form->setButtons($buttons = m::mock(FormDefaultTestMockFormButtons::class))
        );

        $this->assertEquals($buttons, $form->getButtons());
    }

    /**
     * @covers FormDefault::getButtons
     */
    public function test_redefine_default_buttons()
    {
        $this->app->instance(
            FormButtonsInterface::class,
            $buttons = m::mock(FormButtonsInterface::class)
        );

        $form = $this->getFormElement();
        $this->assertEquals($buttons, $form->getButtons());
    }

    /**
     * @covers FormDefault::getView
     * @covers FormDefault::setView
     */
    public function test_gets_and_sets_view()
    {
        $form = $this->getFormElement();
        $this->assertEquals('form.default', $form->getView());

        $this->assertEquals($form, $form->setView($view = 'custom.template'));
        $this->assertEquals($view, $form->getView());
    }

    /**
     * @covers FormDefault::setAction
     * @covers FormDefault::getAction
     */
    public function test_gets_and_sets_action()
    {
        $form = $this->getFormElement();

        $this->assertEquals($form, $form->setAction('action'));
        $this->assertEquals('action', $form->getAction());
    }

    /**
     * @covers FormDefault::setModelClass
     * @covers FormDefault::getClass
     * @covers FormDefault::getModel
     */
    public function test_gets_and_sets_model_class()
    {
        $form = $this->getFormElement();

        $this->assertEquals(
            $form,
            $form->setModelClass($class = FormDefaultTestMockModel::class)
        );

        $this->assertEquals($class, $form->getClass());
    }

    public function test_sets_model_class_exception()
    {
        $form = $this->getFormElement();

        $form->setModelClass($class = FormDefaultTestMockModel::class);
        $form->setModelClass(\Illuminate\Database\Eloquent\Model::class);

        $this->assertEquals($class, $form->getClass());
    }

    /**
     * @covers FormDefault::getModelConfiguration
     */
    public function test_gets_model_configuration()
    {
        $this->getSleepingOwlMock()
            ->shouldReceive('getModel')
            ->once()
            ->with($model = FormDefaultTestMockModel::class)
            ->andReturn($return = 'model_configuration');

        $form = $this->getFormElement();
        $form->setModelClass($model);

        $this->assertEquals($return, $form->getModelConfiguration());
    }

    /**
     * @covers FormDefault::getModel
     * @covers FormDefault::setModel
     */
    //public function test_gets_model()
    //{
    //    $this->app->instance(
    //        FormButtonsInterface::class,
    //        $buttons = m::mock(FormButtonsInterface::class)
    //    );
    //
    //    $this->app->instance(
    //        RepositoryInterface::class,
    //        $repository = m::mock(RepositoryInterface::class)
    //    );
    //
    //    $model = new FormDefaultTestMockModel();
    //
    //    $buttons->shouldReceive('setModel')->once()->with($model);
    //
    //    $form = $this->getFormElement([
    //        $element = m::mock(FormElementInterface::class),
    //    ]);
    //
    //    $element->shouldReceive('setModel')->once()->with($model);
    //    $repository->shouldReceive('find')->with(1)->andReturn($model);
    //
    //    $this->assertEquals(
    //        $form,
    //        $form->setId(1)
    //    );
    //}

    /**
     * @covers FormDefault::saveForm
     */
    public function test_save_form()
    {
        $request = $this->getRequest();

        $model = m::mock(FormDefaultTestMockModel::class);

        $model->shouldReceive('getRelations')->twice()->andReturn([]);
        $model->shouldReceive('save')->once();
        $model->shouldReceive('getConnectionName');

        $modelConfiguration = m::mock(ModelConfigurationInterface::class);
        $modelConfiguration->shouldReceive('fireEvent')->times(4)->andReturn(true);

        $this->getSleepingOwlMock()
            ->shouldReceive('getModel')
            ->andReturn($modelConfiguration);

        $this->app->instance(
            RepositoryInterface::class,
            $repository = m::mock(RepositoryInterface::class)
        );

        $repository->shouldReceive('setClass')->once();

        $form = $this->getFormElement([
            $element = m::mock(FormElementInterface::class),
        ]);

        $element->shouldReceive('initialize')->once();
        $element->shouldReceive('setModel');
        $element->shouldReceive('isReadonly')->twice()->andReturn(false);
        $element->shouldReceive('isVisible')->twice()->andReturn(true);
        $element->shouldReceive('save')->once()->with($request);
        $element->shouldReceive('afterSave')->once()->with($request);

        $form->setModelClass(FormDefaultTestMockModel::class);
        $form->initialize();
        $repository->shouldReceive('find')->with(1)->andReturn($model);

        $form->setId(1);

        $this->assertTrue($form->saveForm($request, $modelConfiguration));
    }

    public function test_save_relations()
    {
        $this->markTestSkipped('
            TODO need to write tests for FormDefault::saveBelongsToRelations and FormDefault::saveHasOneRelations
        ');
    }

    public function test_validate()
    {
        $request = $this->getRequest();
        $request->offsetSet('element', 'test');

        $this->validate($request);
    }

    /**
     * @expectedException \Illuminate\Validation\ValidationException
     */
    public function test_validate_with_exception()
    {
        $this->validate($this->getRequest());
    }

    protected function validate(\Illuminate\Http\Request $request)
    {
        $modelConfiguration = m::mock(ModelConfigurationInterface::class);
        $modelConfiguration->shouldReceive('fireEvent')->once()->andReturn(true);

        $this->app->instance(
            RepositoryInterface::class,
            $repository = m::mock(RepositoryInterface::class)
        );
        $repository->shouldReceive('setClass')->once();

        $model = m::mock(FormDefaultTestMockModel::class);

        $model->shouldReceive('getConnectionName')->andReturn('default');

        $this->getSleepingOwlMock()
            ->shouldReceive('getModel')
            ->andReturn($modelConfiguration);

        $form = $this->getFormElement([
            $element = m::mock(FormElementInterface::class),
        ]);
        $element->shouldReceive('initialize')->once();
        $element->shouldReceive('setModel');
        $element->shouldReceive('getValidationRules')->once()
            ->andReturn(['element' => 'required']);
        $element->shouldReceive('getValidationMessages')->once()->andReturn([]);
        $element->shouldReceive('getValidationLabels')->once()->andReturn([
            'element' => 'Element label',
        ]);

        $element->shouldReceive('isReadonly')->andReturn(false);
        $element->shouldReceive('isVisible')->andReturn(true);

        $form->setModelClass(FormDefaultTestMockModel::class);
        $form->initialize();
        $repository->shouldReceive('find')->with(1)->andReturn($model);

        $this->assertNull(
            $form->validateForm($request, $modelConfiguration)
        );
    }
}

class FormDefaultTestMockModel extends \Illuminate\Database\Eloquent\Model
{
}

abstract class FormDefaultTestMockFormButtons implements FormButtonsInterface
{
}
