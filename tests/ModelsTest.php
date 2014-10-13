<?php

use SleepingOwl\Admin\Models\ModelItem;
use SleepingOwl\Admin\Models\Models;

class ModelsTest extends PHPUnit_Framework_TestCase
{
	/**
	 * @var Models
	 */
	protected $models;

	function __construct()
	{
		$this->models = new Models;
	}

	/** @test */
	public function it_adds_model_item_and_fetches_it_by_alias()
	{
		$modelItem = Mockery::mock(ModelItem::class);
		$modelItem->shouldReceive('getAlias')->withNoArgs()->once()->andReturn('model-alias');

		$this->models->addItem($modelItem);
		$this->assertEquals($modelItem, $this->models->modelWithAlias('model-alias'));
	}

	/** @test */
	public function it_throws_an_exception_when_no_models_found_by_alias()
	{
		$this->setExpectedException(\SleepingOwl\Admin\Exceptions\ModelNotFoundException::class);
		$modelItem = Mockery::mock(ModelItem::class);
		$modelItem->shouldReceive('getAlias')->withNoArgs()->once()->andReturn('model-alias');

		$this->models->addItem($modelItem);
		$this->models->modelWithAlias('model-alias-unknown');
	}

	/** @test */
	public function it_adds_model_item_and_fetches_it_by_classname()
	{
		$modelItem = Mockery::mock(ModelItem::class);
		$modelItem->shouldReceive('getModelClass')->withNoArgs()->once()->andReturn('\Foo\Bar\Model');

		$this->models->addItem($modelItem);
		$this->assertEquals($modelItem, $this->models->modelWithClassname('\Foo\Bar\Model'));
	}

	/** @test */
	public function it_throws_an_exception_when_no_models_found_by_classname()
	{
		$this->setExpectedException(\SleepingOwl\Admin\Exceptions\ModelNotFoundException::class);
		$modelItem = Mockery::mock(ModelItem::class);
		$modelItem->shouldReceive('getModelClass')->withNoArgs()->once()->andReturn('\Foo\Bar\Model');

		$this->models->addItem($modelItem);
		$this->models->modelWithClassname('\Foo\Bar\UnknownModel');
	}
}