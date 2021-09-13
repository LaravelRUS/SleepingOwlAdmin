<?php

use Mockery as m;
use SleepingOwl\Admin\Form\FormElement;

class FormElementTest extends TestCase
{
    public function tearDown(): void
    {
        m::close();
    }

    /**
     * @return \PHPUnit\Framework\MockObject\MockObject
     *
     * @throws ReflectionException
     */
    protected function getElement()
    {
        return $this->getMockForAbstractClass(FormElement::class);
    }

    /**
     * @covers SleepingOwl\Admin\Form\FormElement::initialize
     */
    public function test_initializable()
    {
        //\KodiCMS\Assets\Facades\Meta::shouldReceive('loadPackage')->once();

        $this->assertNull(
            $this->getElement()->initialize()
        );
    }

    /**
     * @covers SleepingOwl\Admin\Form\FormElement::getValidationRules
     * @covers SleepingOwl\Admin\Form\FormElement::addValidationRule
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
     * @covers SleepingOwl\Admin\Form\FormElement::getValidationRules
     * @covers SleepingOwl\Admin\Form\FormElement::addValidationRule
     * @covers SleepingOwl\Admin\Form\FormElement::addValidationMessage
     * @covers SleepingOwl\Admin\Form\FormElement::getValidationMessages
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
     * @covers SleepingOwl\Admin\Form\FormElement::getValidationMessages
     * @covers SleepingOwl\Admin\Form\FormElement::addValidationMessage
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
     * @covers SleepingOwl\Admin\Form\FormElement::getValidationMessages
     * @covers SleepingOwl\Admin\Form\FormElement::setValidationMessages
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
     * @covers SleepingOwl\Admin\Form\FormElement::getValidationRules
     * @covers SleepingOwl\Admin\Form\FormElement::setValidationRules
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
     * @covers SleepingOwl\Admin\Form\FormElement::getValidationRules
     * @covers SleepingOwl\Admin\Form\FormElement::setValidationRules
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
     * @covers SleepingOwl\Admin\Form\FormElement::setView
     */
    public function test_set_view()
    {
        $element = $this->getElement();

        $this->assertEquals($element, $element->setView('my.custom.view'));

        $this->assertEquals('my.custom.view', $element->getView());
    }

    /**
     * @covers SleepingOwl\Admin\Form\FormElement::getModel
     * @covers SleepingOwl\Admin\Form\FormElement::setModel
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
     * @covers SleepingOwl\Admin\Form\FormElement::toArray
     */
    public function test_is_arrayable()
    {
        $array = $this->getElement()->toArray();
        $this->assertTrue(is_array($array));
        $test_array = ['value', 'readonly', 'visibled', 'model'];
        $real_array = array_keys($array);
        sort($test_array);
        sort($real_array);
        $this->assertEquals($test_array, $real_array);
    }

    /**
     * @covers SleepingOwl\Admin\Form\FormElement::render
     */
    public function test_render()
    {
        $template = m::mock(\SleepingOwl\Admin\Contracts\TemplateInterface::class);
        $template->shouldReceive('view')->andReturn($view = m::mock(\Illuminate\Contracts\View\View::class));

        $this->app->instance('sleeping_owl.template', $template);

        $this->assertEquals($view, $this->getElement()->render());
    }

    /**
     * @covers SleepingOwl\Admin\Form\FormElement::__toString
     */
    public function test_converts_into_string()
    {
        $template = m::mock(\SleepingOwl\Admin\Contracts\TemplateInterface::class);
        $template->shouldReceive('view->__toString')->andReturn('hello world');

        $this->app->instance('sleeping_owl.template', $template);

        $this->assertEquals('hello world', (string) $this->getElement());
    }

    /**
     * @covers SleepingOwl\Admin\Form\FormElement::isReadonly
     * @covers SleepingOwl\Admin\Form\FormElement::setReadonly
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
     * @covers SleepingOwl\Admin\Form\FormElement::isValueSkipped()
     * @covers SleepingOwl\Admin\Form\FormElement::setValueSkipped()
     */
    public function test_valueSkipped()
    {
        $element = $this->getElement();

        $this->assertEquals($element, $element->setValueSkipped(true));
        $this->assertTrue($element->isValueSkipped());

        $element->setValueSkipped(false);
        $this->assertFalse($element->isValueSkipped());

        $model = m::mock(\Illuminate\Database\Eloquent\Model::class);
        $model->shouldReceive('isAuthor')->andReturn(true)->once();

        $element->setModel($model);

        $element->setValueSkipped(function ($model) {
            return $model->isAuthor();
        });

        $this->assertTrue($element->isValueSkipped());
    }

    /**
     * @covers SleepingOwl\Admin\Form\FormElement::isVisible
     */
    public function test_visibility()
    {
        $element = $this->getElement();
        $model = m::mock(\Illuminate\Database\Eloquent\Model::class);
        $model->shouldReceive('isAuthor')->andReturn(true);
        $element->setModel($model);

        $this->assertEquals(
            $element,
            $element->setVisible(function ($model) {
                return $model->isAuthor();
            })
        );

        $this->assertTrue($element->isVisible());
    }
}
