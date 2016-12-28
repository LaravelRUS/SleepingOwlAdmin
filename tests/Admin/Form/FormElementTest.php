<?php

use Mockery as m;
use SleepingOwl\Admin\Form\FormElement;

class FormElementTest extends TestCase
{
    public function tearDown()
    {
        m::close();
    }

    /**
     * @return FormElement|PHPUnit_Framework_MockObject_MockObject
     */
    protected function getElement()
    {
        return $this->getMockForAbstractClass(FormElement::class);
    }

    /**
     * FormDefault::__construct
     * FormDefault::getElements
     * FormDefault::getButtons.
     */
    public function test_constructor()
    {
        PackageManager::shouldReceive('load')->once();
        PackageManager::shouldReceive('add')->once();

        $this->getElement();
    }

    /**
     * @covers FormElement::initialize
     */
    public function test_initializable()
    {
        \KodiCMS\Assets\Facades\Meta::shouldReceive('loadPackage')->once();

        $this->assertNull(
            $this->getElement()->initialize()
        );
    }

    /**
     * @covers FormElement::getValidationRules
     * @covers FormElement::addValidationRule
     */
    public function test_adds_validation_rule()
    {
        $element = $this->getElement();

        $this->assertEmpty($element->getValidationRules());

        $rule = 'some_rule';

        $this->assertEquals($element, $element->addValidationRule($rule));
        $this->assertEquals([$rule], $element->getValidationRules());
    }

    /**
     * @covers FormElement::getValidationRules
     * @covers FormElement::addValidationRule
     * @covers FormElement::addValidationMessage
     * @covers FormElement::getValidationMessages
     */
    public function test_adds_validation_rule_with_message()
    {
        $element = $this->getElement();

        $this->assertEmpty($element->getValidationRules());
        $this->assertEmpty($element->getValidationMessages());

        $element->addValidationRule(
            $rule = 'some_rule',
            $message = 'my custom message'
        );

        $this->assertEquals([$rule], $element->getValidationRules());
        $this->assertEquals([$rule => $message], $element->getValidationMessages());
    }

    /**
     * @covers FormElement::getValidationMessages
     * @covers FormElement::addValidationMessage
     */
    public function test_adds_validation_message()
    {
        $element = $this->getElement();
        $this->assertEmpty($element->getValidationMessages());

        $this->assertEquals(
            $element,
            $element->addValidationMessage(
                $rule = 'min:10',
                $message = 'my custom message'
            )
        );

        $element->addValidationMessage(
            $rule1 = 'string',
            $message1 = 'my custom message 1'
        );

        $this->assertEquals(['min' => $message, $rule1 => $message1], $element->getValidationMessages());
    }

    /**
     * @covers FormElement::getValidationMessages
     * @covers FormElement::setValidationMessages
     */
    public function test_sets_validation_messages()
    {
        $element = $this->getElement();
        $this->assertEmpty($element->getValidationMessages());

        $this->assertEquals(
            $element,
            $element->setValidationMessages([
                'min' => 'test',
                'max' => 'test',
            ])
        );

        $this->assertEquals(['min' => 'test', 'max' => 'test'], $element->getValidationMessages());

        $element->setValidationMessages([
            'max' => 'test',
        ]);

        $this->assertEquals(['max' => 'test'], $element->getValidationMessages());
    }

    /**
     * @covers FormElement::getValidationRules
     * @covers FormElement::setValidationRules
     */
    public function test_sets_validation_rules_as_array()
    {
        $element = $this->getElement();

        $this->assertEmpty($element->getValidationRules());

        $this->assertEquals(
            $element,
            $element->setValidationRules([
                'rule|one',
                'rule|two',
            ])
        );

        $this->assertEquals([
            'rule', 'one', 'rule', 'two',
        ], $element->getValidationRules());
    }

    /**
     * @covers FormElement::getValidationRules
     * @covers FormElement::setValidationRules
     */
    public function test_sets_validation_rules_as_arguments()
    {
        $element = $this->getElement();

        $this->assertEmpty($element->getValidationRules());
        $element->setValidationRules('rule|one', 'rule|two');
        $this->assertEquals([
            'rule', 'one', 'rule', 'two',
        ], $element->getValidationRules());
    }

    /**
     * @covers FormElement::setView
     */
    public function test_set_view()
    {
        $element = $this->getElement();

        $this->assertEquals($element, $element->setView('my.custom.view'));

        $this->assertEquals('my.custom.view', $element->getView());
    }

    /**
     * @covers FormElement::getModel
     * @covers FormElement::setModel
     */
    public function test_get_and_set_model()
    {
        $element = $this->getElement();
        $this->assertEmpty($element->getModel());

        $model = m::mock(\Illuminate\Database\Eloquent\Model::class);

        $this->assertEquals($element, $element->setModel($model));
        $this->assertEquals($model, $element->getModel());
    }

    /**
     * @covers FormElement::toArray
     */
    public function test_is_arrayable()
    {
        $array = $this->getElement()->toArray();
        $this->assertTrue(is_array($array));
        $this->assertEquals(['value', 'readonly', 'model'], array_keys($array));
    }

    /**
     * @covers FormElement::render
     */
    public function test_render()
    {
        $template = m::mock(\SleepingOwl\Admin\Contracts\TemplateInterface::class);
        $template->shouldReceive('view')->andReturn($view = m::mock(\Illuminate\Contracts\View\View::class));

        $this->app->instance('sleeping_owl.template', $template);

        $this->assertEquals($view, $this->getElement()->render());
    }

    /**
     * @covers FormElement::__toString
     */
    public function test_converts_into_string()
    {
        $template = m::mock(\SleepingOwl\Admin\Contracts\TemplateInterface::class);
        $template->shouldReceive('view->__toString')->andReturn('hello world');

        $this->app->instance('sleeping_owl.template', $template);

        $this->assertEquals('hello world', (string) $this->getElement());
    }

    /**
     * @covers FormElement::isReadonly
     * @covers FormElement::setReadonly
     */
    public function test_readOnly()
    {
        $element = $this->getElement();

        $this->assertEquals($element, $element->setReadonly(true));
        $this->assertTrue($element->isReadonly());

        $element->setReadonly(false);
        $this->assertFalse($element->isReadonly());

        $model = m::mock(\Illuminate\Database\Eloquent\Model::class);
        $model->shouldReceive('isAuthor')->andReturn(true)->once();

        $element->setModel($model);

        $element->setReadonly(function ($model) {
            return $model->isAuthor();
        });

        $this->assertTrue($element->isReadonly());
    }

    /**
     * @covers FormElement::setVisibilityCondition
     * @covers FormElement::isVisible
     */
    public function test_visibility()
    {
        $element = $this->getElement();
        $model = m::mock(\Illuminate\Database\Eloquent\Model::class);
        $model->shouldReceive('isAuthor')->andReturn(true)->once();
        $element->setModel($model);

        $this->assertEquals(
            $element,
            $element->setVisibilityCondition(function ($model) {
                return $model->isAuthor();
            })
        );

        $this->assertTrue($element->isVisible());
    }
}
