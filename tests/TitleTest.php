<?php

use SleepingOwl\Admin\Models\Filters\Title;

class TitleTestModel
{
	public $title;
	public $name;

	public static function findOrFail($id, $columns = ['*'])
	{
		if ($id == 10)
		{
			throw new \Exception;
		}
		$instance = new static;
		$instance->title = 'title from model';
		$instance->name = 'title from model custom field';
		return $instance;
	}

}

class TitleTest extends \PHPUnit_Framework_TestCase
{
	/**
	 * @var \Mockery\Mock
	 */
	protected $from;

	protected function setUp()
	{
		parent::setUp();
		$this->from = Mockery::mock('\Illuminate\Database\Eloquent\Model');
	}

	/** @test */
	public function it_can_use_static_title()
	{
		$title = new Title;
		$title->title('static title');
		$this->assertEquals('static title', $title->get(1));
	}

	/** @test */
	public function it_can_use_model_to_load_title_from()
	{
		$title = new Title;
		$title->from(TitleTestModel::class);
		$this->assertEquals('title from model', $title->get(1));
	}

	/** @test */
	public function it_can_use_model_custom_attribute_to_load_title_from()
	{
		$title = new Title;
		$title->from(TitleTestModel::class, 'name');
		$this->assertEquals('title from model custom field', $title->get(1));
	}

	/** @test */
	public function it_throws_an_exception_when_title_fields_not_set()
	{
		$title = new Title;
		$this->setExpectedException('\SleepingOwl\Admin\Exceptions\TitleNotFormattedException');
		$title->get(1);
	}

	/** @test */
	public function it_throws_an_exception_when_title_attribute_not_found()
	{
		$title = new Title;
		$this->setExpectedException('\SleepingOwl\Admin\Exceptions\ModelAttributeNotFoundException');
		$title->from(TitleTestModel::class, 'unsetAttribute');
		$title->get(1);
	}

	/** @test */
	public function it_throws_an_exception_when_model_not_found()
	{
		$title = new Title;
		$this->setExpectedException('\Exception');
		$title->from(TitleTestModel::class, 'title');
		$title->get(10);
	}

}
