<?php

use SleepingOwl\Admin\Model\ModelConfiguration;

class ModelConfigurationTest extends TestBase
{

	/**
	 * @var ModelConfiguration
	 */
	protected $model;

	public function setUp()
	{
		parent::setUp();

		$this->model = new ModelConfiguration('MyModel');
	}

	/** @test */
	public function it_initializes()
	{
		$this->assertInstanceOf('SleepingOwl\Admin\Model\ModelConfiguration', $this->model);
	}

	/** @test */
	public function it_generates_default_alias()
	{
		$this->assertEquals('my_models', $this->model->alias());

		$model = new ModelConfiguration('My\Model');
		$this->assertEquals('models', $model->alias());

		$model = new ModelConfiguration('My\Models');
		$this->assertEquals('models', $model->alias());

		$model = new ModelConfiguration('My\Sub\Car');
		$this->assertEquals('cars', $model->alias());
	}

	/** @test */
	public function it_provides_repository()
	{
		$repository = $this->model->repository();
		$this->assertInstanceOf('SleepingOwl\Admin\Repository\BaseRepository', $repository);
	}

	/** @test */
	public function it_suports_alias()
	{
		$model = new ModelConfiguration('My\Model');
		$model->alias('my-new-alias');
		$this->assertEquals('my-new-alias', $model->alias());
	}

	/** @test */
	public function it_suports_title()
	{
		$model = new ModelConfiguration('My\Model');
		$model->title('My Title');
		$this->assertEquals('My Title', $model->title());
	}

	/** @test */
	public function it_supports_create_form_from_callback()
	{
		$model = new ModelConfiguration('My\Model');
		$model->create(function ()
		{
			return 42;
		});
		$this->assertEquals(42, $model->create());
	}

	/** @test */
	public function it_supports_edit_form_from_callback()
	{
		$model = new ModelConfiguration('My\Model');
		$model->edit(function ($id)
		{
			return $id;
		});
		$this->assertEquals(42, $model->edit(42));
	}

	/** @test */
	public function it_suports_create_and_edit_form_at_once()
	{
		$model = new ModelConfiguration('My\Model');
		$model->createAndEdit(function ($id)
		{
			if (is_null($id))
			{
				return 15;
			}
			return $id;
		});
		$this->assertEquals(15, $model->create());
		$this->assertEquals(42, $model->edit(42));
	}

	/** @test */
	public function it_supports_delete_configuration()
	{
		$model = new ModelConfiguration('My\Model');

		$model->delete(null);
		$this->assertEquals(null, $model->delete(42));

		$model->delete(false);
		$this->assertEquals(false, $model->delete(42));

		$model->delete(function ($id)
		{
			return null;
		});
		$this->assertEquals(null, $model->delete(42));

		$model->delete(function ($id)
		{
			return $id;
		});
		$this->assertEquals(42, $model->delete(42));
	}

	/** @test */
	public function it_supports_restore_configuration()
	{
		$model = new ModelConfiguration('My\Model');

		$model->restore(null);
		$this->assertEquals(null, $model->restore(42));

		$model->restore(false);
		$this->assertEquals(false, $model->restore(42));

		$model->restore(function ($id)
		{
			return null;
		});
		$this->assertEquals(null, $model->restore(42));

		$model->restore(function ($id)
		{
			return $id;
		});
		$this->assertEquals(42, $model->restore(42));
	}

	/** @test */
	public function it_supports_display_form_from_callback()
	{
		$model = new ModelConfiguration('My\Model');
		$model->display(function ()
		{
			return 42;
		});
		$this->assertEquals(42, $model->display());
	}
	
	/** @test */
	public function it_provides_urls()
	{
		$this->assertEquals('http://localhost/admin/my_models', $this->model->displayUrl());
		$this->assertEquals('http://localhost/admin/my_models?param=42', $this->model->displayUrl(['param' => 42]));

		$this->assertEquals('http://localhost/admin/my_models/create', $this->model->createUrl());
		$this->assertEquals('http://localhost/admin/my_models/create?param=42', $this->model->createUrl(['param' => 42]));

		$this->assertEquals('http://localhost/admin/my_models', $this->model->storeUrl());
		$this->assertEquals('http://localhost/admin/my_models/42/edit', $this->model->editUrl(42));
		$this->assertEquals('http://localhost/admin/my_models/42', $this->model->updateUrl(42));
		$this->assertEquals('http://localhost/admin/my_models/42', $this->model->deleteUrl(42));
		$this->assertEquals('http://localhost/admin/my_models/42/restore', $this->model->restoreUrl(42));
	}

}