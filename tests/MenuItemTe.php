<?php 

class MenuItemTest extends TestBase
{

	/** @test */
	public function it_supports_label()
	{
		$menu = Admin::menu()->label('My Label');
		$this->assertEquals('My Label', $menu->label());
	}

	/** @test */
	public function it_supports_icon()
	{
		$menu = Admin::menu()->icon('fa-user');
		$this->assertEquals('fa-user', $menu->icon());
	}

	/** @test */
	public function it_supports_subitems()
	{
		$menu = Admin::menu()->items(function ()
		{
			Admin::menu();
			Admin::menu();
			Admin::menu();
		});
		$items = $menu->items();
		$this->assertCount(3, $items);

		$this->assertEquals(1, $menu->level());
		$this->assertEquals(2, $items[0]->level());
	}

	/** @test */
	public function it_support_urls()
	{
		$menu = Admin::menu('MyModel');
		$this->assertEquals('http://localhost/admin/my_models', $menu->url());

		$menu->url('my-url');
		$this->assertEquals('http://localhost/admin/my-url', $menu->url());

		$menu->url('http://google.com');
		$this->assertEquals('http://google.com', $menu->url());
	}

}