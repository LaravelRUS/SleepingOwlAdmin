<?php

use Illuminate\Contracts\Support\Renderable;
use Mockery as m;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\WithModel;
use SleepingOwl\Admin\Display\DisplayTab;

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
    
    public function test_constructor_without_optional_args()
    {
        $renderable = m::mock(Renderable::class);

        $tab = $this->createMock($classname = DisplayTab::class);

        $tab->expects($this->never())->method('setLabel');
        $tab->expects($this->never())->method('setIcon');

        $reflectedClass = new ReflectionClass($classname);
        $constructor = $reflectedClass->getConstructor();
        $constructor->invoke($tab, $renderable);
    }

    public function test_constructor_with_optional_args()
    {
        $renderable = m::mock(Renderable::class);

        $tab = $this->createMock($classname = DisplayTab::class);

        $tab->expects($this->once())->method('setLabel')>with($this->equalTo($label = 'TestLabel'));
        $tab->expects($this->once())->method('setIcon')>with($this->equalTo($icon = 'TestIcon'));

        $reflectedClass = new ReflectionClass($classname);
        $constructor = $reflectedClass->getConstructor();
        $constructor->invokeArgs($tab, [$renderable, $label, $icon]);
    }

    public function test_gets_and_sets_label()
    {
        $tab = $this->getTab(null, null);

        $this->assertNull($tab->getLabel());
        $this->assertEquals($tab, $tab->setLabel($label = 'test label'));
        $this->assertEquals($label, $tab->getLabel());
    }

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

    public function test_gets_and_sets_icon()
    {
        $tab = $this->getTab(null, null);

        $this->assertNull($tab->getIcon());
        $this->assertEquals($tab, $tab->setIcon($icon = 'fa fa-test'));
        $this->assertEquals($icon, $tab->getIcon());
    }

    public function test_gets_content()
    {
        $tab = $this->getTab(null, null);
        $this->assertInstanceOf(Renderable::class, $tab->getContent());
    }

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

    public function test_sets_action_and_id()
    {
        $tab = $this->getTab(null, null);

        $content = $tab->getContent();
        $content->shouldNotReceive('setAction');
        $content->shouldNotReceive('setId');

        $this->assertEquals($tab, $tab->setAction('test'));
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

    public function test_validate_form()
    {
        $tab = $this->getTab(null, null);

        $content = $tab->getContent();
        $content->shouldNotReceive('validateForm');

        $this->assertNull($tab->validateForm(m::mock(\SleepingOwl\Admin\Contracts\ModelConfigurationInterface::class)));
    }

    public function test_validate_form_with_form_content()
    {
        $renderable = m::mock(\SleepingOwl\Admin\Contracts\FormInterface::class);

        $tab = new DisplayTab($renderable);
        $model = m::mock(\SleepingOwl\Admin\Contracts\ModelConfigurationInterface::class);

        $renderable->shouldReceive('validateForm')->once()->with($model);

        $this->assertNull($tab->validateForm($model));
    }

    public function test_save_form()
    {
        $tab = $this->getTab(null, null);

        $content = $tab->getContent();
        $content->shouldNotReceive('saveForm');

        $this->assertEquals($tab, $tab->saveForm(m::mock(\SleepingOwl\Admin\Contracts\ModelConfigurationInterface::class)));
    }

    public function test_save_form_with_form_content()
    {
        $renderable = m::mock(\SleepingOwl\Admin\Contracts\FormInterface::class);

        $tab = new DisplayTab($renderable);
        $model = m::mock(\SleepingOwl\Admin\Contracts\ModelConfigurationInterface::class);
        $renderable->shouldReceive('saveForm')->once()->with($model);

        $this->assertEquals($tab, $tab->saveForm($model));
    }

    public function test_sets_model()
    {
        $tab = $this->getTab(null, null);

        $content = $tab->getContent();
        $content->shouldNotReceive('setModel');

        $this->assertEquals($tab, $tab->setModel(m::mock(\Illuminate\Database\Eloquent\Model::class)));
    }

    public function test_sets_model_with_modelable_content()
    {
        $renderable = m::mock(\SleepingOwl\Admin\Contracts\FormInterface::class);

        $tab = new DisplayTab($renderable);
        $model = m::mock(\Illuminate\Database\Eloquent\Model::class);
        $renderable->shouldReceive('setModel')->once()->with($model);

        $this->assertEquals($tab, $tab->setModel($model));
    }
}

abstract class DisplayTabTestInitializable implements Renderable, Initializable {

}

abstract class DisplayTabTestWithModel implements Renderable, WithModel {

}