<?php

use SleepingOwl\Admin\Model\ModelConfiguration;

class AdminTest extends TestBase
{

	/** @test */
	public function it_initializes()
	{
		$this->assertInstanceOf('SleepingOwl\Admin\Admin', Admin::instance());
	}

	/** @test */
	public function it_creates_model_configuration()
	{
		$model = Admin::model('Foo\Bar\Model');
		$this->assertInstanceOf('SleepingOwl\Admin\Model\ModelConfiguration', $model);
	}

	/** @test */
	public function it_provides_registered_models()
	{
		$models = Admin::models();
		$this->assertArrayHasKey('Foo\Bar\Model', $models);
		$this->assertInstanceOf('SleepingOwl\Admin\Model\ModelConfiguration', $models['Foo\Bar\Model']);
	}

	/** @test */
	public function it_provides_model_aliases()
	{
		$aliases = Admin::modelAliases();
		$this->assertArrayHasKey('Foo\Bar\Model', $aliases);
		$this->assertEquals('models', $aliases['Foo\Bar\Model']);
	}

	/** @test */
	public function it_provides_access_to_model_from_admin_instance()
	{
		$model = Admin::instance()->getModel('Foo\Bar\Model');
		$this->assertInstanceOf('SleepingOwl\Admin\Model\ModelConfiguration', $model);
	}

	/** @test */
	public function it_provides_registered_models_from_admin_instance()
	{
		$models = Admin::instance()->getModels();
		$this->assertArrayHasKey('Foo\Bar\Model', $models);
		$this->assertInstanceOf('SleepingOwl\Admin\Model\ModelConfiguration', $models['Foo\Bar\Model']);
	}

	/** @test */
	public function it_checks_model_for_registered()
	{
		$this->assertEquals(true, Admin::instance()->hasModel('Foo\Bar\Model'));
		$this->assertEquals(false, Admin::instance()->hasModel('Bar\Baz\Model'));
	}

	/** @test */
	public function it_allows_manually_create_model_configuration()
	{
		$model = new ModelConfiguration('My\Model');
		Admin::instance()->setModel('My\Model', $model);

		$model = Admin::model('My\Model');
		$this->assertInstanceOf('SleepingOwl\Admin\Model\ModelConfiguration', $model);
	}

	/** @test */
	public function it_provides_current_template_instance()
	{
		$template = Admin::instance()->template();
		$this->assertInstanceOf('SleepingOwl\Admin\Templates\TemplateDefault', $template);
	}

	/** @test */
	public function it_creates_menu_item()
	{
		$menu = Admin::menu('Foo\Bar\Model');
		$this->assertInstanceOf('SleepingOwl\Admin\Menu\MenuItem', $menu);
	}

	/** @test */
	public function it_provides_root_menu_items()
	{
		Admin::menu('My\Model');
		$items = Admin::instance()->getMenu();
		$this->assertCount(2, $items);
		$this->assertContainsOnlyInstancesOf('SleepingOwl\Admin\Menu\MenuItem', $items);
	}

	/** @test */
	public function it_renders_view_within_admin_layout()
	{
		$view = Admin::view('my-content', 'my-title');
		$data = $view->getData();

		$this->assertArrayHasKey('content', $data);
		$this->assertEquals('my-content', $data['content']);

		$this->assertArrayHasKey('title', $data);
		$this->assertEquals('my-title', $data['title']);
	}

}
 