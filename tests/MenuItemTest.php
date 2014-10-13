<?php

use SleepingOwl\Admin\Admin;
use SleepingOwl\Admin\Menu\MenuItem;

class MenuItemTestModel
{

}

class MenuItemTest extends AdminTest
{

	/** @test */
	public function it_initializes()
	{
		$menu = new MenuItem;
		$this->assertInstanceOf('\SleepingOwl\Admin\Menu\MenuItem', $menu);
	}

	/** @test */
	public function it_adds_self_to_current()
	{
		$menu = new MenuItem;
		$this->assertTrue(in_array($menu, MenuItem::$current->getItems()), 'Menu item havent been added to current menu.');
	}

	/** @test */
	public function it_gets_label_from_model_item()
	{
		Admin::model('\MenuItemTestModel')->title('Test Title');

		$menu = new MenuItem('\MenuItemTestModel');
		$this->assertEquals('Test Title', $menu->getLabel());
	}

	/** @test */
	public function it_sets_label()
	{
		$menu = new MenuItem;
		$menu->label('menu-label');
		$this->assertEquals('menu-label', $menu->getLabel());
	}

	/** @test */
	public function it_sets_icon()
	{
		$menu = new MenuItem;
		$menu->icon('menu-icon');
		$this->assertEquals('menu-icon', $menu->getIcon());
	}

	/** @test */
	public function it_sets_uses(){
		$menu = new MenuItem;
		$menu->uses('my-uses');
		$this->assertEquals('my-uses', $menu->getUses());
	}

	/** @test */
	public function it_fetches_item_by_url()
	{
		$menu = new MenuItem;
		$menu->url('test');

		$this->assertEquals($menu, $menu->itemWithUrl('test'));
		$this->assertEquals($menu, MenuItem::$current->itemWithUrl('test'));
	}

	/** @test */
	public function it_generates_url_to_item()
	{
		$menu = new MenuItem();
		$menu->url('/');
		$this->assertEquals('route-wildcard', $menu->getUrl());

		Admin::model('\MenuItemTestModel');

		$menu = new MenuItem('\MenuItemTestModel');
		$this->assertEquals('route-to-model', $menu->getUrl());
	}

	/** @test */
	public function it_accepts_items_creating_callback()
	{
		$testObject = Mockery::mock();
		$testObject->shouldReceive('call')->once();

		$menu = new MenuItem;
		$callback = function () use ($testObject, $menu)
		{
			assert($menu === MenuItem::$current);
			$testObject->call();
		};
		$this->assertEquals($menu, $menu->items($callback));
	}

	/** @test */
	public function it_checks_if_has_subitems()
	{
		$menu = new MenuItem;
		$this->assertFalse($menu->hasSubItems());

		$this->assertTrue(MenuItem::$current->hasSubItems());
	}

	/** @test */
	public function it_renders()
	{
		$menuWithItems = new MenuItem;
		$menuWithItems->label('With Items');
		for ($i = 0; $i < 3; $i++)
		{
			$menu = new MenuItem;
			$menu->label('Test Label')->icon('fa-test');
			$result = $menu->render();
			$this->assertEquals('<li><a><i></i> Test Label</a></li>', $result);

			$menuWithItems->addItem($menu);
		}

		$result = $menuWithItems->render();
		$this->assertEquals('<li><a><i></i> With Items<span></span></a><ul><li><a><i></i> Test Label</a></li><li><a><i></i> Test Label</a></li><li><a><i></i> Test Label</a></li></ul></li>', $result);
	}

}
 