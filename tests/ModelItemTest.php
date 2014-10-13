<?php

use SleepingOwl\Admin\Models\ModelItem;
use SleepingOwl\Models\Interfaces\ModelWithOrderFieldInterface;

class ModelItemTestClass implements ModelWithOrderFieldInterface
{
	public function getOrderValue()
	{
	}

	public function moveUp()
	{
	}

	public function moveDown()
	{
	}

	public function getSortField()
	{
	}
}

class ModelItemTest extends AdminTest
{
	/** @test */
	public function it_initializes()
	{
		$modelItem = new ModelItem('\Foo\Bar\Model');
		$this->assertInstanceOf('\SleepingOwl\Admin\Models\ModelItem', $modelItem);
	}

	/** @test */
	public function it_adds_self_to_models()
	{
		$modelItem = new ModelItem('\Foo\Bar\Model');
		$model = $this->admin->models->modelWithClassname('\Foo\Bar\Model');
		$this->assertEquals($modelItem, $model);
	}

	/** @test */
	public function it_generates_alias()
	{
		$modelItem = new ModelItem('\Foo\Bar\Model');
		$this->assertEquals('models', $modelItem->getAlias());

		$model = $this->admin->models->modelWithAlias('models');
		$this->assertEquals($modelItem, $model);
	}

	/** @test */
	public function it_determine_is_model_is_sortable()
	{
		$modelItem = new ModelItem('\Foo\Bar\Model');
		$this->assertTrue($modelItem->isOrderable());

		$modelItem = new ModelItem('\ModelItemTestClass');
		$this->assertFalse($modelItem->isOrderable());
	}

	/** @test */
	public function it_sets_the_title()
	{
		$modelItem = new ModelItem('\Foo\Bar\Model');
		$modelItem->title('model-title');
		$this->assertEquals('model-title', $modelItem->getTitle());
	}

	/** @test */
	public function it_stores_a_form()
	{
		$modelItem = new ModelItem('\Foo\Bar\Model');
		$this->assertInstanceOf('\SleepingOwl\Admin\Models\Form\Form', $modelItem->getForm());
	}

	/** @test */
	public function it_accepts_form_creation_callback()
	{
		$testObject = Mockery::mock();
		$testObject->shouldReceive('call')->once();

		$modelItem = new ModelItem('\Foo\Bar\Model');
		$callback = function () use ($testObject, $modelItem)
		{
			assert($modelItem === ModelItem::$current);
			$testObject->call();
		};
		$this->assertEquals($modelItem, $modelItem->form($callback));
	}

	/** @test */
	public function it_creates_model_item_filters()
	{
		$filter = ModelItem::filter('name');
		$this->assertInstanceOf('\SleepingOwl\Admin\Models\Filters\Filter', $filter);

		$testObject = Mockery::mock();
		$testObject->shouldReceive('call')->once();

		$modelItem = new ModelItem('\Foo\Bar\Model');
		$callback = function () use ($testObject, $modelItem)
		{
			assert($modelItem === ModelItem::$current);
			$testObject->call();
		};
		$this->assertEquals($modelItem, $modelItem->filters($callback));
	}

	/** @test */
	public function it_applies_filters()
	{
		$filter = Mockery::mock('\SleepingOwl\Admin\Models\Filters\Filter');
		$builder = Mockery::mock('\Illuminate\Database\Eloquent\Builder');

		$filter->shouldReceive('filter')->with($builder, ['param' => 'value'])->once()->andReturn('filter-result-title');

		$modelItem = new ModelItem('\Foo\Bar\Model');
		$modelItem->addFilter($filter);
		$result = $modelItem->applyFilters($builder, ['param' => 'value']);
		$this->assertEquals(['filter-result-title'], $result);
	}

	/** @test */
	public function it_accepts_column_creating_callback()
	{
		$testObject = Mockery::mock();
		$testObject->shouldReceive('call')->once();

		$modelItem = new ModelItem('\Foo\Bar\Model');
		$callback = function () use ($testObject, $modelItem)
		{
			assert($modelItem === ModelItem::$current);
			$testObject->call();
		};
		$this->assertEquals($modelItem, $modelItem->columns($callback));
	}

	/** @test */
	public function it_stores_columns()
	{
		$column = Mockery::mock('\SleepingOwl\Admin\Columns\Column\String');

		$modelItem = new ModelItem('\Foo\Bar\Model');
		$modelItem->addColumn($column);
		$this->assertTrue(in_array($column, $modelItem->getColumns()), 'Column havent been added to model item.');
	}

	/** @test */
	public function it_stores_eager_load_information()
	{
		$modelItem = new ModelItem('\Foo\Bar\Model');
		$this->assertEquals($modelItem, $modelItem->with('one', 'tho', 'three'));
		$this->assertEquals([
			'one',
			'tho',
			'three'
		], $modelItem->getWith());
	}

	/** @test */
	public function it_accept_alias_name()
	{
		$modelItem = new ModelItem('\Foo\Bar\Model');
		$this->assertEquals($modelItem, $modelItem->as('model-title'));
		$this->assertEquals('model-title', $modelItem->getAlias());
	}

	/** @test */
	public function it_throws_an_exception_on_unknown_method()
	{
		$this->setExpectedException('\SleepingOwl\Admin\Exceptions\MethodNotFoundException');

		$modelItem = new ModelItem('\Foo\Bar\Model');
		$modelItem->call();
	}

	/** @test */
	public function it_render_table_attributes()
	{
		$this->admin->htmlBuilder->shouldReceive('attributes')->with([])->once()->andReturn('table-attributes');
		$this->admin->htmlBuilder->shouldReceive('attributes')->with(['data-ordering' => 'false'])->once()->andReturn('table-attributes-with-ordering');

		$modelItem = new ModelItem('\Foo\Bar\Model');
		$attr = $modelItem->renderTableAttributes();
		$this->assertEquals('table-attributes', $attr);

		$modelItem = new ModelItem('\ModelItemTestClass');
		$attr = $modelItem->renderTableAttributes();
		$this->assertEquals('table-attributes-with-ordering', $attr);
	}

}
 