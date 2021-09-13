<?php

use Illuminate\Contracts\Support\Renderable;
use Mockery as m;
use SleepingOwl\Admin\Contracts\Form\FormElementInterface;
use SleepingOwl\Admin\Contracts\Form\FormInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\Validable;
use SleepingOwl\Admin\Contracts\WithModelInterface;
use SleepingOwl\Admin\Display\DisplayTab;

class DisplayTabTest extends TestCase
{
    public function tearDown(): void
    {
        m::close();
    }

    /**
     * @param  string  $label
     * @param  string  $icon
     * @return SleepingOwl\Admin\Display\DisplayTab
     */
    public function getTab($label = 'Test Label', $icon = 'Test icon')
    {
        $renderable = m::mock(Renderable::class);

        return new DisplayTab($renderable, $label, $icon);
    }

    /**
     * @covers SleepingOwl\Admin\Display\DisplayTab::__construct
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
     * @covers SleepingOwl\Admin\Display\DisplayTab::__construct
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
     * @covers SleepingOwl\Admin\Display\DisplayTab::setLabel
     * @covers SleepingOwl\Admin\Display\DisplayTab::getLabel
     */
    public function test_gets_and_sets_label()
    {
        $tab = $this->getTab(null, null);

        $this->assertNull($tab->getLabel());
        $this->assertEquals($tab, $tab->setLabel($label = 'test label'));
        $this->assertEquals($label, $tab->getLabel());
    }

    /**
     * @covers SleepingOwl\Admin\Display\DisplayTab::isActive
     * @covers SleepingOwl\Admin\Display\DisplayTab::setActive
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
     * @covers SleepingOwl\Admin\Display\DisplayTab::getName
     * @covers SleepingOwl\Admin\Display\DisplayTab::setName
     */
    public function test_gets_and_sets_name()
    {
        $tab = $this->getTab(null, null);

        $tab->setLabel($label = 'test label');
        $this->assertEquals(md5($label), $tab->getName());

        $this->assertEquals($tab, $tab->setName($name = 'test'));
        $this->assertEquals($name, $tab->getName());
    }

    public function test_gets_name_exception()
    {
        $this->expectException(\SleepingOwl\Admin\Exceptions\Display\DisplayTabException::class);
        $tab = $this->getTab(null, null);

        $tab->getName();
    }

    /**
     * @covers SleepingOwl\Admin\Display\DisplayTab::setIcon
     * @covers SleepingOwl\Admin\Display\DisplayTab::getIcon
     */
    public function test_gets_and_sets_icon()
    {
        $tab = $this->getTab(null, null);

        $this->assertNull($tab->getIcon());
        $this->assertEquals($tab, $tab->setIcon($icon = 'fas fa-tachometer-alt'));
        $this->assertEquals($icon, $tab->getIcon());
    }

    /**
     * @covers SleepingOwl\Admin\Display\DisplayTab::getContent
     */
    public function test_gets_content()
    {
        $tab = $this->getTab(null, null);
        $this->assertInstanceOf(Renderable::class, $tab->getContent());
    }

    /**
     * @covers SleepingOwl\Admin\Display\DisplayTab::setModelClass
     */
    public function test_sets_model_class()
    {
        $tab = $this->getTab(null, null);
        $this->assertInstanceOf(Renderable::class, $tab->getContent());

        $content = $tab->getContent();

        $content->shouldNotReceive('setModelClass');

        $this->assertEquals($tab, $tab->setModelClass('class'));
    }

    /**
     * @covers SleepingOwl\Admin\Display\DisplayTab::initialize
     */
    public function test_initialize()
    {
        $tab = $this->getTab(null, null);

        $content = $tab->getContent();
        $content->shouldNotReceive('initialize');

        $this->assertEquals($tab, $tab->initialize());
    }

    /**
     * @covers SleepingOwl\Admin\Display\DisplayTab::setAction
     * @covers SleepingOwl\Admin\Display\DisplayTab::setId
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

    /**
     * @covers SleepingOwl\Admin\Display\DisplayTab::validateForm
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
        $renderable = m::mock(FormInterface::class);

        $tab = new DisplayTab($renderable);
        $model = m::mock(\SleepingOwl\Admin\Contracts\ModelConfigurationInterface::class);
        $request = $this->getRequest();
        $renderable->shouldReceive('validateForm')->once()->with($request, $model);

        $this->assertNull($tab->validateForm($request, $model));
    }

    /**
     * @covers SleepingOwl\Admin\Display\DisplayTab::saveForm
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
        $renderable = m::mock(FormInterface::class);

        $request = $this->getRequest();

        $tab = new DisplayTab($renderable);
        $model = m::mock(\SleepingOwl\Admin\Contracts\ModelConfigurationInterface::class);
        $renderable->shouldReceive('saveForm')->once()->with($request, $model);

        $this->assertNull($tab->saveForm($request, $model));
    }

    /**
     * @covers SleepingOwl\Admin\Display\DisplayTab::setModel
     * @covers SleepingOwl\Admin\Display\DisplayTab::getModel
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
        $renderable = m::mock(FormInterface::class);

        $tab = new DisplayTab($renderable);
        $model = m::mock(\Illuminate\Database\Eloquent\Model::class);
        $renderable->shouldReceive('setModel')->once()->with($model);
        $renderable->shouldReceive('getModel')->once()->andReturn($model);

        $this->assertEquals($tab, $tab->setModel($model));
        $this->assertEquals($model, $tab->getModel());
    }

    /**
     * @covers SleepingOwl\Admin\Display\DisplayTab::getValidationRules
     * @covers SleepingOwl\Admin\Display\DisplayTab::getValidationMessages
     * @covers SleepingOwl\Admin\Display\DisplayTab::getValidationLabels
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
     * @covers SleepingOwl\Admin\Display\DisplayTab::save
     * @covers SleepingOwl\Admin\Display\DisplayTab::afterSave
     * @covers SleepingOwl\Admin\Display\DisplayTab::getValue
     * @covers SleepingOwl\Admin\Display\DisplayTab::isReadonly
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
     * @covers SleepingOwl\Admin\Display\DisplayTab::save
     * @covers SleepingOwl\Admin\Display\DisplayTab::afterSave
     */
    public function test_save_with_savable_content()
    {
        $request = $this->getRequest();

        $renderable = m::mock(FormElementInterface::class);
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
     * @covers SleepingOwl\Admin\Display\DisplayTab::getElement
     * @covers SleepingOwl\Admin\Display\DisplayTab::getElements
     * @covers SleepingOwl\Admin\Display\DisplayTab::setElements
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
     * @covers SleepingOwl\Admin\Display\DisplayTab::toArray
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

abstract class DisplayTabTestWithModel implements Renderable, WithModelInterface
{
}

abstract class DisplayTabTestValidable implements Renderable, Validable
{
}
