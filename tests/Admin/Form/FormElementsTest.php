<?php

use Illuminate\Contracts\Support\Arrayable;
use Mockery as m;
use SleepingOwl\Admin\Contracts\Form\FormElementInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\Validable;
use SleepingOwl\Admin\Contracts\WithModelInterface;
use SleepingOwl\Admin\Form\FormElements;

class FormElementsTest extends TestCase
{
    public function tearDown(): void
    {
        m::close();
    }

    /**
     * @param  array  $elements
     * @return FormElements
     */
    public function getElement(array $elements = [])
    {
        return new FormElements($elements);
    }

    /**
     * @covers SleepingOwl\Admin\Form\FormElements::__construct
     */
    public function test_constructor()
    {
        $element = $this->getElement();

        $this->assertInstanceOf(\SleepingOwl\Admin\Form\FormElementsCollection::class, $element->getElements());

        $this->assertEquals(0, $element->getElements()->count());
    }

    /**
     * FormElements::initialize
     * FormElementsTrait::initializeElements.
     */
    public function test_initialize()
    {
        $element = $this->getElement([
            $element1 = m::mock(FormElementInterface::class),
            $element3 = m::mock(FormElementsTestInitializableMock::class),
            $element4 = m::mock(FormElementsTestInitializableMockWithoutInitializable::class),
        ]);

        $element1->shouldReceive('initialize')->once();
        $element3->shouldReceive('initialize')->once();
        $element4->shouldNotReceive('initialize');

        //Meta::shouldReceive('loadPackage')->once();

        $element->initialize();

        $this->assertEquals(3, $element->getElements()->count());
    }

    public function test_recursive_iterator()
    {
        // One level
        $elements = $this->getElement([
            $element1 = m::mock(FormElementInterface::class),
            $element3 = m::mock(FormElementsTestInitializableMock::class),
            $element4 = m::mock(FormElementsTestInitializableMockWithoutInitializable::class),
        ]);

        $count = 0;
        $elements->recursiveIterateElements(function ($element) use (&$count) {
            $count++;
        });

        $this->assertEquals(3, $count);

        // With sublevel
        $elements = $this->getElement([
            m::mock(FormElementInterface::class),
            m::mock(FormElementsTestInitializableMock::class),
            $this->getElement([
                m::mock(FormElementInterface::class),
                m::mock(FormElementsTestInitializableMock::class),
                $this->getElement([
                    m::mock(FormElementInterface::class),
                    m::mock(FormElementsTestInitializableMock::class),
                ]),
            ]),
        ]);

        $count = 0;
        $elements->recursiveIterateElements(function ($element) use (&$count) {
            $count++;
        });

        $this->assertEquals(6, $count);

        // One level with break
        $elements = $this->getElement([
            $element1 = m::mock(FormElementInterface::class),
            $element3 = m::mock(FormElementsTestInitializableMock::class),
            $element4 = m::mock(FormElementsTestInitializableMockWithoutInitializable::class),
        ]);

        $count = 0;
        $elements->recursiveIterateElements(function ($element) use ($element3, &$count) {
            if ($element === $element3) {
                return true;
            }

            $count++;
        });

        $this->assertEquals(1, $count);

        // Sublevel With break
        $elements = $this->getElement([
            m::mock(FormElementInterface::class),
            m::mock(FormElementsTestInitializableMock::class),
            $this->getElement([
                m::mock(FormElementInterface::class),
                $element2 = m::mock(FormElementsTestInitializableMock::class),
                $this->getElement([
                    m::mock(FormElementInterface::class),
                    m::mock(FormElementsTestInitializableMock::class),
                ]),
            ]),
        ]);

        $count = 0;
        $elements->recursiveIterateElements(function ($element) use ($element2, &$count) {
            if ($element === $element2) {
                return true;
            }

            $count++;
        });

        $this->assertEquals(3, $count);
    }

    public function test_recursive_iterator_with_tabs()
    {
        $tabs = AdminDisplay::tabbed();

        $tabs->appendTab(AdminForm::elements([
            $element4 = m::mock(FormElementInterface::class),
        ]), 'Form');

        // One level
        $elements = $this->getElement([
            $element1 = m::mock(FormElementInterface::class),
            $tabs,
        ]);

        $count = 0;
        $elements->recursiveIterateElements(function ($element) use (&$count) {
            $count++;
        });

        $this->assertEquals(2, $count);
    }

    /**
     * FormElements::setModel
     * FormElements::getModel
     * FormElementsTrait::setModelForElements.
     */
    public function test_sets_model()
    {
        $element = $this->getElement([
            $element1 = m::mock(FormElementInterface::class),
            $element3 = m::mock(FormElementsTestInitializableMock::class),
            $element4 = m::mock(FormElementsTestInitializableMockWithoutInitializable::class),
        ]);

        $model = m::mock(\Illuminate\Database\Eloquent\Model::class);

        $element1->shouldReceive('setModel')->once()->with($model);
        $element3->shouldNotReceive('setModel');
        $element4->shouldReceive('setModel')->once()->with($model);

        $this->assertEquals($element, $element->setModel($model));

        $this->assertEquals(3, $element->getElements()->count());
        $this->assertEquals($model, $element->getModel());
    }

    /**
     * FormElements::getValidationRules
     * FormElementsTrait::getValidationRulesFromElements.
     */
    public function test_gets_validation_rules()
    {
        $element = $this->getElement([
            $element1 = m::mock(FormElementInterface::class),
            $element2 = m::mock(FormElementInterface::class),
            $element3 = m::mock(FormElementInterface::class),
            $element4 = m::mock(FormElementsTestInitializableMock::class),
            $element5 = m::mock(FormElementsTestInitializableMockWithoutInitializable::class),
            $element6 = m::mock(FormElementsTestInitializableMockWithoutValidable::class),
        ]);

        $element1->shouldReceive('isReadonly')->once()->andReturn(false);
        $element1->shouldReceive('isVisible')->andReturn(true);
        $element1->shouldReceive('getValidationRules')->once()->andReturn(['element1' => 'required']);

        $element2->shouldReceive('isReadonly')->once()->andReturn(true);
        $element2->shouldNotReceive('isVisible');
        $element2->shouldNotReceive('getValidationRules');

        $element3->shouldReceive('isReadonly')->once()->andReturn(false);
        $element3->shouldReceive('isVisible')->andReturn(false);
        $element3->shouldNotReceive('getValidationRules');

        $element4->shouldNotReceive('isReadonly');
        $element4->shouldNotReceive('isVisible');
        $element4->shouldNotReceive('getValidationRules');

        $element5->shouldNotReceive('isReadonly');
        $element5->shouldNotReceive('isVisible');
        $element5->shouldNotReceive('getValidationRules');

        $element6->shouldNotReceive('isReadonly');
        $element6->shouldNotReceive('isVisible');
        $element6->shouldReceive('getValidationRules')->once()->andReturn(['element6' => 'unique']);

        $this->assertEquals([
            'element1' => 'required',
            'element6' => 'unique',
        ], $element->getValidationRules());
    }

    /**
     * FormElements::save
     * FormElementsTrait::saveElements.
     */
    public function test_save()
    {
        $element = $this->getElement([
            $element1 = m::mock(FormElementInterface::class),
            $element2 = m::mock(FormElementInterface::class),
            $element3 = m::mock(FormElementInterface::class),
            $element4 = m::mock(FormElementsTestInitializableMock::class),
            $element5 = m::mock(FormElementsTestInitializableMockWithoutInitializable::class),
            $element6 = m::mock(FormElementsTestInitializableMockWithoutValidable::class),
        ]);

        $request = $this->getRequest();

        $element1->shouldReceive('isReadonly')->once()->andReturn(false);
        $element1->shouldReceive('isVisible')->andReturn(true);
        $element1->shouldReceive('save')->once()->with($request);

        $element2->shouldReceive('isReadonly')->once()->andReturn(true);
        $element2->shouldNotReceive('isVisible');
        $element1->shouldNotReceive('save');

        $element3->shouldReceive('isReadonly')->once()->andReturn(false);
        $element3->shouldReceive('isVisible')->andReturn(false);
        $element1->shouldNotReceive('save');

        $element4->shouldNotReceive('isReadonly');
        $element1->shouldNotReceive('save');

        $element5->shouldNotReceive('isReadonly');
        $element1->shouldNotReceive('save');

        $element6->shouldNotReceive('isReadonly');
        $element1->shouldNotReceive('save');

        $this->assertNull(
            $element->save($request)
        );
    }

    /**
     * FormElements::afterSave
     * FormElementsTrait::afterSaveElements.
     */
    public function test_after_save()
    {
        $element = $this->getElement([
            $element1 = m::mock(FormElementInterface::class),
            $element2 = m::mock(FormElementInterface::class),
            $element3 = m::mock(FormElementInterface::class),
            $element4 = m::mock(FormElementsTestInitializableMock::class),
            $element5 = m::mock(FormElementsTestInitializableMockWithoutInitializable::class),
            $element6 = m::mock(FormElementsTestInitializableMockWithoutValidable::class),
        ]);

        $request = $this->getRequest();

        $element1->shouldReceive('isReadonly')->once()->andReturn(false);
        $element1->shouldReceive('isVisible')->andReturn(true);
        $element1->shouldReceive('afterSave')->once()->with($request);

        $element2->shouldReceive('isReadonly')->once()->andReturn(true);
        $element2->shouldNotReceive('isVisible');
        $element1->shouldNotReceive('afterSave');

        $element3->shouldReceive('isReadonly')->once()->andReturn(false);
        $element3->shouldReceive('isVisible')->andReturn(false);
        $element1->shouldNotReceive('afterSave');

        $element4->shouldNotReceive('isReadonly');
        $element1->shouldNotReceive('afterSave');

        $element5->shouldNotReceive('isReadonly');
        $element1->shouldNotReceive('afterSave');

        $element6->shouldNotReceive('isReadonly');
        $element1->shouldNotReceive('afterSave');

        $this->assertNull(
            $element->afterSave($request)
        );
    }

    /**
     * FormElements::toArray.
     */
    public function test_to_array()
    {
        $element = $this->getElement([
            $element1 = m::mock(FormElementInterface::class),
            $element2 = m::mock(FormElementInterface::class),
            $element3 = m::mock(FormElementInterface::class),
            $element4 = m::mock(FormElementsTestInitializableMock::class),
            $element5 = m::mock(FormElementsTestInitializableMockWithoutInitializable::class),
            $element6 = m::mock(FormElementsTestInitializableMockWithoutValidable::class),
        ]);

        // By default element is visible
        // If element is instance of FormElementInterface, then uses method isVisible

        $element1->shouldReceive('isVisible')->once()->andReturn(true); // visible
        $element2->shouldReceive('isVisible')->once()->andReturn(false);
        $element3->shouldReceive('isVisible')->once()->andReturn(false);
        $element4->shouldNotReceive('isVisible'); // visible
        $element5->shouldNotReceive('isVisible'); // visible
        $element6->shouldNotReceive('isVisible'); // visible

        $array = $element->toArray();

        $this->assertEquals(4, $array['items']->count());
        $this->assertCount(4, array_intersect([
            'value', 'readonly', 'model', 'items',
        ], array_keys($array)));
    }
}

abstract class FormElementsTestInitializableMock implements Initializable
{
}

abstract class FormElementsTestInitializableMockWithoutInitializable implements WithModelInterface, Arrayable
{
}

abstract class FormElementsTestInitializableMockWithoutValidable implements Validable
{
}
