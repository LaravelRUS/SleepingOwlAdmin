<?php

use Mockery as m;
use SleepingOwl\Admin\Contracts\Form\FormButtonsInterface;
use SleepingOwl\Admin\Contracts\Form\FormElementInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\Repositories\RepositoryInterface;
use SleepingOwl\Admin\Form\FormDefault;

class FormDefaultTest extends TestCase
{
    use \SleepingOwl\Tests\AssetsTesterTrait;

    public function getFormElement(array $elements = [])
    {
        return new FormDefault($elements);
    }

    public function test_without_upload_fields()
    {
        $form = $this->makeFormDefault([
            $this->makeMockForFormElement(FormElementInterface::class),
            $this->makeMockForFormElement(FormElementInterface::class),
        ]);

        $this->assertFalse($form->hasHtmlAttribute('enctype'));
        $form->initialize();
        $this->assertFalse($form->hasHtmlAttribute('enctype'));

        $form = $this->makeFormDefault([
            $this->makeMockForFormElement(FormElementInterface::class),
            new \SleepingOwl\Admin\Form\Card\Header([
                new \SleepingOwl\Admin\Form\Card\Footer([
                    $this->makeMockForFormElement(FormElementInterface::class),
                ]),
            ]),
        ]);

        $this->assertFalse($form->hasHtmlAttribute('enctype'));
        $form->initialize();
        $this->assertFalse($form->hasHtmlAttribute('enctype'));
    }

    public function test_auto_append_enctype_with_one_level()
    {
        $form = $this->makeFormDefault([
            $this->makeMockForFormElement(FormElementInterface::class),
            $this->makeMockForFormElement(\SleepingOwl\Admin\Form\Element\Upload::class),
        ]);

        $this->assertFalse($form->hasHtmlAttribute('enctype'));

        $form->initialize();

        $this->assertEquals('multipart/form-data', $form->getHtmlAttribute('enctype'));
    }

    public function test_auto_append_enctype_with_sub_level()
    {
        $form = $this->makeFormDefault([
            $this->makeMockForFormElement(FormElementInterface::class),
            new \SleepingOwl\Admin\Form\Card\Header([
                new \SleepingOwl\Admin\Form\Card\Footer([
                    $this->makeMockForFormElement(\SleepingOwl\Admin\Form\Element\Upload::class),
                ]),
            ]),
        ]);

        $this->assertFalse($form->hasHtmlAttribute('enctype'));

        $form->initialize();

        $this->assertEquals('multipart/form-data', $form->getHtmlAttribute('enctype'));
    }

    /**
     * @covers SleepingOwl\Admin\Form\FormDefault::__construct
     * @covers SleepingOwl\Admin\Form\FormDefault::getElements
     * @covers SleepingOwl\Admin\Form\FormDefault::getButtons
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
     * @covers SleepingOwl\Admin\Form\FormDefault::initialize
     * @covers SleepingOwl\Admin\Form\FormDefault::getRepository
     */
    public function test_initialize()
    {
        $this->packageInitialized();

        $form = $this->makeFormDefault([
            $element = $this->makeMockForFormElement(FormElementInterface::class),
            $element2 = $this->makeMockForFormElement(FormElementInterface::class),
        ]);

        $form->setAction('action');

        $this->assertNull($form->getRepository());

        $form->initialize();

        //$this->assertEquals('POST', $form->getHtmlAttribute('method'));
        //$this->assertEquals('action', $form->getHtmlAttribute('action'));

        $this->assertInstanceOf(RepositoryInterface::class, $form->getRepository());
        $this->assertFalse($form->hasHtmlAttribute('enctype'));
    }

    /**
     * @covers SleepingOwl\Admin\Form\FormDefault::getButtons
     * @covers SleepingOwl\Admin\Form\FormDefault::setButtons
     */
    public function test_gets_and_sets_buttons()
    {
        $form = $this->getFormElement();

        $this->assertInstanceOf(FormButtonsInterface::class, $form->getButtons());

        $this->assertEquals($form, $form->setButtons($buttons = m::mock(FormDefaultTestMockFormButtons::class)));

        $this->assertEquals($buttons, $form->getButtons());
    }

    /**
     * @covers SleepingOwl\Admin\Form\FormDefault::getButtons
     */
    public function test_redefine_default_buttons()
    {
        $this->app->instance(FormButtonsInterface::class, $buttons = m::mock(FormButtonsInterface::class));

        $form = $this->getFormElement();
        $this->assertEquals($buttons, $form->getButtons());
    }

    /**
     * @covers SleepingOwl\Admin\Form\FormDefault::getView
     * @covers SleepingOwl\Admin\Form\FormDefault::setView
     */
    public function test_gets_and_sets_view()
    {
        $form = $this->getFormElement();
        $this->assertEquals('form.default', $form->getView());

        $this->assertEquals($form, $form->setView($view = 'custom.template'));
        $this->assertEquals($view, $form->getView());
    }

    /**
     * @covers SleepingOwl\Admin\Form\FormDefault::setAction
     * @covers SleepingOwl\Admin\Form\FormDefault::getAction
     */
    public function test_gets_and_sets_action()
    {
        $form = $this->getFormElement();

        $this->assertEquals($form, $form->setAction('action'));
        $this->assertEquals('action', $form->getAction());
    }

    /**
     * @covers SleepingOwl\Admin\Form\FormDefault::setModelClass
     * @covers SleepingOwl\Admin\Form\FormDefault::getClass
     * @covers SleepingOwl\Admin\Form\FormDefault::getModel
     */
    public function test_gets_and_sets_model_class()
    {
        $form = $this->getFormElement();

        $this->assertEquals($form, $form->setModelClass($class = FormDefaultTestMockModel::class));

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
     * @covers SleepingOwl\Admin\Form\FormDefault::getModelConfiguration
     */
    public function test_gets_model_configuration()
    {
        $this->getSleepingOwlMock()->shouldReceive('getModel')->once()->with($model = FormDefaultTestMockModel::class)->andReturn($return = 'model_configuration');

        $form = $this->getFormElement();
        $form->setModelClass($model);

        $this->assertEquals($return, $form->getModelConfiguration());
    }

    /**
     * @covers SleepingOwl\Admin\Form\FormDefault::getModel
     * @covers SleepingOwl\Admin\Form\FormDefault::setModel
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
     * @covers SleepingOwl\Admin\Form\FormDefault::saveForm
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

        $this->getSleepingOwlMock()->shouldReceive('getModel')->andReturn($modelConfiguration);

        $this->app->instance(RepositoryInterface::class, $repository = m::mock(RepositoryInterface::class));

        $repository->shouldReceive('setClass')->once();

        $form = $this->getFormElement([
            $element = m::mock(FormElementInterface::class),
        ]);

        $element->shouldReceive('initialize')->once();
        $element->shouldReceive('setModel');
        $element->shouldReceive('isReadonly')->twice()->andReturn(false);
        $element->shouldReceive('isVisible')->andReturn(true);
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

    public function test_validate_with_exception()
    {
        $this->expectException(\Illuminate\Validation\ValidationException::class);
        $this->validate($this->getRequest());
    }

    protected function validate(\Illuminate\Http\Request $request)
    {
        $modelConfiguration = m::mock(ModelConfigurationInterface::class);
        $modelConfiguration->shouldReceive('fireEvent')->once()->andReturn(true);

        $this->app->instance(RepositoryInterface::class, $repository = m::mock(RepositoryInterface::class));
        $repository->shouldReceive('setClass')->once();

        $model = m::mock(FormDefaultTestMockModel::class);

        $model->shouldReceive('getConnectionName')->andReturn('default');

        $this->getSleepingOwlMock()->shouldReceive('getModel')->andReturn($modelConfiguration);

        $form = $this->getFormElement([
            $element = m::mock(FormElementInterface::class),
        ]);
        $element->shouldReceive('initialize')->once();
        $element->shouldReceive('setModel');
        $element->shouldReceive('getValidationRules')->once()->andReturn(['element' => 'required']);
        $element->shouldReceive('getValidationMessages')->andReturn([]);
        $element->shouldReceive('getValidationLabels')->once()->andReturn([
            'element' => 'Element label',
        ]);

        $element->shouldReceive('isReadonly')->andReturn(false);
        $element->shouldReceive('isVisible')->andReturn(true);

        $form->setModelClass(FormDefaultTestMockModel::class);
        $form->initialize();
        $repository->shouldReceive('find')->with(1)->andReturn($model);

        $this->assertNull($form->validateForm($request, $modelConfiguration));
    }
}

class FormDefaultTestMockModel extends \Illuminate\Database\Eloquent\Model
{
}

abstract class FormDefaultTestMockFormButtons implements FormButtonsInterface
{
}
