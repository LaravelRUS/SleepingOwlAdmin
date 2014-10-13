<?php

use SleepingOwl\Admin\Models\Filters\Filter;
use SleepingOwl\Admin\Models\ModelItem;

class FilterTest extends \PHPUnit_Framework_TestCase
{
	/** @test */
	public function it_applies_filter_by_name()
	{
		$filter = new Filter('field');
		$filter->title('title');

		$query = Mockery::mock('Illuminate\Database\Eloquent\Builder');
		$query->shouldReceive('where')->with('field', '=', 'field-value')->once();

		$filter->filter($query, ['field' => 'field-value']);
	}

	/** @test */
	public function it_applies_filter_scope()
	{
		$filter = new Filter('field');
		$filter->title('title');
		$filter->scope('testScope');

		$query = Mockery::mock('Illuminate\Database\Eloquent\Builder');
		$query->shouldReceive('testScope')->with('yes')->once();

		$filter->filter($query, ['field' => 'yes']);
	}

	/** @test */
	public function it_applies_filter_by_alias()
	{
		$filter = new Filter('field');
		$filter->title('title');
		$filter->as('fieldAlias');

		$query = Mockery::mock('Illuminate\Database\Eloquent\Builder');
		$query->shouldReceive('where')->with('field', '=', 'value')->once();

		$filter->filter($query, ['fieldAlias' => 'value']);
	}

	/** @test */
	public function it_applies_filter_with_static_value()
	{
		$filter = new Filter('field');
		$filter->title('title');
		$filter->value(10);

		$query = Mockery::mock('Illuminate\Database\Eloquent\Builder');
		$query->shouldReceive('where')->with('field', '=', '10')->once();

		$filter->filter($query, ['field' => 'yes']);
	}

	/** @test */
	public function it_returns_filter_title()
	{
		$filter = new Filter('field');
		$filter->title('title');
		$filter->value(10);

		$query = Mockery::mock('Illuminate\Database\Eloquent\Builder');
		$query->shouldReceive('where')->with('field', '=', '10')->once();

		$title = $filter->filter($query, ['field' => 'yes']);
		$this->assertEquals('title', $title);
	}

	/** @test */
	public function it_sets_default_alias()
	{
		$filter = new Filter('field');
		$this->assertEquals('field', $filter->getAlias());
	}

	/** @test */
	public function it_throws_an_exception_when_unknown_method_called()
	{
		$this->setExpectedException(\SleepingOwl\Admin\Exceptions\MethodNotFoundException::class);

		$filter = new Filter('field');
		$filter->test();
	}

	/** @test */
	public function it_adds_myself_to_current_modelitem_on_create()
	{
		$modelItem = Mockery::mock('SleepingOwl\Admin\Models\ModelItem');
		$modelItem->shouldReceive('addFilter')->once();
		ModelItem::$current = $modelItem;
		$filter = new Filter('field');
	}
}
 