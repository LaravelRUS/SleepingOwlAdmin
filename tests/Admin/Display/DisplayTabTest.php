<?php

use Mockery as m;
use SleepingOwl\Admin\Display\DisplayTab;
use SleepingOwl\Admin\Contracts\Validable;
use SleepingOwl\Admin\Contracts\WithModel;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\DisplayInterface;

class DisplayTabTest extends TestCase
{
    public function tearDown()
    {
        m::close();
    }

    /**
     * @param string $label
     * @param string $icon
     *
     * @return DisplayTab
     */
    public function getTab($label = 'Test Label', $icon = 'Test icon')
    {
        $renderable = m::mock(Renderable::class);

        return new DisplayTab($renderable, $label, $icon);
    }

    /**
     * @covers DisplayTab::__construct
     */
    public function test_constructor_without_optional_args()
    {
        $renderable = m::mock(Renderable::class);

        $tab = $this->createMock($classname = DisplayTab::class);

        $tab->expects($this->never())->method('setLabel');
        $tab->expects($this->never())->method('setIcon');

        $reflectedClass = new ReflectionClass($classname);
        $constructor = $reflectedClass->getConstructor();
        $constructor->invoke($tab, $renderable);

        $this->assertContains(\SleepingOwl\Admin\Traits\VisibleCondition::class, class_uses_recursive($tab));
        $this->assertContains(\SleepingOwl\Admin\Traits\Renderable::class, class_uses_recursive($tab));
    }

    /**
     * @covers DisplayTab::__construct
     */
    public function test_constructor_with_optional_args()
    {
        $renderable = m::mock(Renderable::class);

        $tab = $this->createMock($classname = DisplayTab::class);

        $tab->expects($this->once())->method('setLabel') > with($this->equalTo($label = 'TestLabel'));
        $tab->expects($this->once())->method('setIcon') > with($this->equalTo($icon = 'TestIcon'));

        $reflectedClass = new ReflectionClass($classname);
        $constructor = $reflectedClass->getConstructor();
        $constructor->invokeArgs($tab, [$renderable, $label, $icon]);
    }

    /**
     * @covers DisplayTab::setLabel
     * @covers DisplayTab::getLabel
     */
    public function test_gets_and_sets_label()
    {
        $tab = $this->getTab(null, null);

        $this->assertNull($tab->getLabel());
        $this->assertEquals($tab, $tab->setLabel($label = 'test label'));
        $this->assertEquals($label, $tab->getLabel());
    }

    /**
     * @covers DisplayTab::isActive
     * @covers DisplayTab::setActive
     */
    public function test_gets_and_sets_active()
    {
        $tab = $this->getTab(null, null);

        $this->assertFalse($tab->isActive());

        $this->assertEquals($tab, $tab->setActive(true));
        $this->assertTrue($tab->isActive());

        $this->assertEquals($tab, $tab->setActive(false));
        $this->assertFalse($tab->isActive());

        $this->assertEquals($tab, $tab->setActive(1));
        $this->assertTrue($tab->isActive());

        $this->assertEquals($tab, $tab->setActive(0));
        $this->assertFalse($tab->isActive());
    }

    /**
     * @covers DisplayTab::getName
     * @covers DisplayTab::setName
     */
    public function test_gets_and_sets_name()
    {
        $tab = $this->getTab(null, null);

        $tab->setLabel($label = 'test label');
        $this->assertEquals(md5($label), $tab->getName());

        $this->assertEquals($tab, $tab->setName($name = 'test'));
        $this->assertEquals($name, $tab->getName());
    }

    /**
     * @expectedException \SleepingOwl\Admin\Exceptions\Display\DisplayTabException
     */
    public function test_gets_name_exception()
    {
        $tab = $this->getTab(null, null);

        $tab->getName();
    }

    /**
     * @covers DisplayTab::setIcon
     * @covers DisplayTab::getIcon
     */
    public function test_gets_and_sets_icon()
    {
        $tab = $this->getTab(null, null);

        $this->assertNull($tab->getIcon());
        $this->assertEquals($tab, $tab->setIcon($icon = 'fa fa-test'));
        $this->assertEquals($icon, $tab->getIcon());
    }

    /**
     * @covers DisplayTab::getContent
     */
    public function test_gets_content()
    {
        $tab = $this->getTab(null, null);
        $this->assertInstanceOf(Renderable::class, $tab->getContent());
    }

    /**
     * @covers DisplayTab::setModelClass
     */
    public function test_sets_model_class()
    {
        $tab = $this->getTab(null, null);
        $this->assertInstanceOf(Renderable::class, $tab->getContent());

        $content = $tab->getContent();

        $content->shouldNotReceive('setModelClass');

        $this->assertEquals($tab, $tab->setModelClass('class'));
    }

    public function test_sets_model_class_with_display_content()
    {
        $renderable = m::mock(DisplayInterface::class);

        $tab = new DisplayTab($renderable);

        $renderable->shouldReceive('setModelClass')->once()->with($class = 'class');

        $tab->setModelClass($class);
    }

    /**
     * @covers DisplayTab::initialize
     */
    public function test_initialize()
    {
        $tab = $this->getTab(null, null);

        $content = $tab->getContent();
        $content->shouldNotReceive('initialize');

        $this->assertEquals($tab, $tab->initialize());
    }

    public function test_initialize_with_initializable_content()
    {
        $renderable = m::mock(DisplayTabTestInitializable::class);

        $tab = new DisplayTab($renderable);

        $renderable->shouldReceive('initialize')->once();

        $tab->initialize();
    }

    /**
     * @covers DisplayTab::setAction
     * @covers DisplayTab::setId
     */
    public function test_sets_action_and_id()
    {
        $tab = $this->getTab(null, null);

        $content = $tab->getContent();
        $content->shouldNotReceive('setAction');
        $content->shouldNotReceive('setId');

        $this->assertEquals($tab, $tab->setAction('test'));
        $this->assertEquals($tab, $tab->setId('test'));
    }

    public function test_sets_action_and_id_with_form_content()
    {
        $renderable = m::mock(\SleepingOwl\Admin\Contracts\FormInterface::class);

        $tab = new DisplayTab($renderable);

        $renderable->shouldReceive('setAction')->once()->with($action = 'test');
        $renderable->shouldReceive('setId')->once()->with($id = 1);

        $tab->setAction($action);
        $tab->setId($id);
    }

    /**
     * @covers DisplayTab::validateForm
     */
    public function test_validate_form()
    {
        $tab = $this->getTab(null, null);

        $content = $tab->getContent();
        $content->shouldNotReceive('validateForm');

        $this->assertNull($tab->validateForm(
            $this->getRequest(),
            m::mock(\SleepingOwl\Admin\Contracts\ModelConfigurationInterface::class)
        ));
    }

    public function test_validate_form_with_form_content()
    {
        $renderable = m::mock(\SleepingOwl\Admin\Contracts\FormInterface::class);

        $tab = new DisplayTab($renderable);
        $model = m::mock(\SleepingOwl\Admin\Contracts\ModelConfigurationInterface::class);
        $request = $this->getRequest();
        $renderable->shouldReceive('validateForm')->once()->with($request, $model);

        $this->assertNull($tab->validateForm($request, $model));
    }

    /**
     * @covers DisplayTab::saveForm
     */
    public function test_save_form()
    {
        $tab = $this->getTab(null, null);

        $content = $tab->getContent();
        $content->shouldNotReceive('saveForm');

        $this->assertNull($tab->saveForm(
            $this->getRequest(), m::mock(\SleepingOwl\Admin\Contracts\ModelConfigurationInterface::class)
        ));
    }

    public function test_save_form_with_form_content()
    {
        $renderable = m::mock(\SleepingOwl\Admin\Contracts\FormInterface::class);

        $request = $this->getRequest();

        $tab = new DisplayTab($renderable);
        $model = m::mock(\SleepingOwl\Admin\Contracts\ModelConfigurationInterface::class);
        $renderable->shouldReceive('saveForm')->once()->with($request, $model);

        $this->assertNull($tab->saveForm($request, $model));
    }

    /**
     * @covers DisplayTab::setModel
     * @covers DisplayTab::getModel
     */
    public function test_sets_and_gets_model()
    {
        $tab = $this->getTab(null, null);

        $content = $tab->getContent();
        $content->shouldNotReceive('setModel');
        $content->shouldNotReceive('getModel');

        $this->assertEquals($tab, $tab->setModel(m::mock(\Illuminate\Database\Eloquent\Model::class)));
        $this->assertNull($tab->getModel());
    }

    public function test_sets_model_with_modelable_content()
    {
        $renderable = m::mock(\SleepingOwl\Admin\Contracts\FormInterface::class);

        $tab = new DisplayTab($renderable);
        $model = m::mock(\Illuminate\Database\Eloquent\Model::class);
        $renderable->shouldReceive('setModel')->once()->with($model);
        $renderable->shouldReceive('getModel')->once()->andReturn($model);

        $this->assertEquals($tab, $tab->setModel($model));
        $this->assertEquals($model, $tab->getModel());
    }

    /**
     * @covers DisplayTab::getValidationRules
     * @covers DisplayTab::getValidationMessages
     * @covers DisplayTab::getValidationLabels
     */
    public function test_gets_validation()
    {
        $tab = $this->getTab(null, null);

        $content = $tab->getContent();
        $content->shouldNotReceive('getValidationRules');
        $content->shouldNotReceive('getValidationMessages');
        $content->shouldNotReceive('getValidationLabels');

        $this->assertEquals([], $tab->getValidationRules());
        $this->assertEquals([], $tab->getValidationMessages());
        $this->assertEquals([], $tab->getValidationLabels());
    }

    public function test_gets_validation_rules_with_validable_content()
    {
        $renderable = m::mock(DisplayTabTestValidable::class);
        $renderable->shouldReceive('getValidationRules')->once()->andReturn($rules = ['rules']);
        $renderable->shouldReceive('getValidationMessages')->once()->andReturn($messages = ['messages']);
        $renderable->shouldReceive('getValidationLabels')->once()->andReturn($labels = ['labels']);

        $tab = new DisplayTab($renderable);

        $this->assertEquals($rules, $tab->getValidationRules());
        $this->assertEquals($messages, $tab->getValidationMessages());
        $this->assertEquals($labels, $tab->getValidationLabels());
    }

    /**
     * @covers DisplayTab::save
     * @covers DisplayTab::afterSave
     * @covers DisplayTab::getValue
     * @covers DisplayTab::isReadonly
     */
    public function test_save()
    {
        $tab = $this->getTab(null, null);

        $content = $tab->getContent();
        $content->shouldNotReceive('save');
        $content->shouldNotReceive('afterSave');
        $content->shouldNotReceive('getValue');
        $content->shouldNotReceive('isReadonly');

        $request = $this->getRequest();

        $this->assertNull($tab->save($request));
        $this->assertNull($tab->afterSave($request));
        $this->assertNull($tab->getValue());
        $this->assertFalse($tab->isReadonly());
    }

    /**
     * @covers DisplayTab::save
     * @covers DisplayTab::afterSave
     */
    public function test_save_with_savable_content()
    {
        $request = $this->getRequest();

        $renderable = m::mock(\SleepingOwl\Admin\Contracts\FormElementInterface::class);
        $renderable->shouldReceive('save')->once()->with($request);
        $renderable->shouldReceive('afterSave')->once()->with($request);

        $renderable->shouldReceive('getValue')->once()->andReturn($value = 'test');
        $renderable->shouldReceive('isReadonly')->once()->andReturn(true);
        $tab = new DisplayTab($renderable);

        $tab->save($request);
        $tab->afterSave($request);
        $this->assertEquals($value, $tab->getValue());
        $this->assertTrue($tab->isReadonly());
    }

    /**
     * @covers DisplayTab::getElement
     * @covers DisplayTab::getElements
     * @covers DisplayTab::setElements
     */
    public function test_gets_element()
    {
        $tab = $this->getTab(null, null);

        $content = $tab->getContent();
        $content->shouldNotReceive('getElement');
        $content->shouldNotReceive('getElements');
        $content->shouldNotReceive('setElements');

        $this->assertNull($tab->getElement('path'));
        $this->assertInstanceOf(\SleepingOwl\Admin\Form\FormElementsCollection::class, $tab->getElements());
        $this->assertEquals($tab, $tab->setElements(['elements']));
    }

    public function test_gets_element_with_elements_content()
    {
        $renderable = m::mock(\SleepingOwl\Admin\Contracts\Form\ElementsInterface::class);
        $renderable->shouldReceive('getElement')->once()->with('path')->andReturn($element = 'element');
        $renderable->shouldReceive('getElements')->once()->andReturn($elements = ['element']);
        $renderable->shouldReceive('setElements')->once()->with($elements);
        $tab = new DisplayTab($renderable);

        $this->assertEquals($element, $tab->getElement('path'));
        $this->assertEquals($elements, $tab->getElements());
        $this->assertEquals($tab, $tab->setElements($elements));
    }

    /**
     * @covers DisplayTab::toArray
     */
    public function test_to_array()
    {
        $tab = $this->getTab(null, null);

        $tab->setLabel('test');

        $this->assertCount(4, array_intersect(array_keys($tab->toArray()), ['label', 'active', 'name', 'icon']));
    }
}

abstract class DisplayTabTestInitializable implements Renderable, Initializable
{
}

abstract class DisplayTabTestWithModel implements Renderable, WithModel
{
}

abstract class DisplayTabTestValidable implements Renderable, Validable
{
}
