<?php

use SleepingOwl\Admin\Admin;
use Illuminate\Support\Facades\Facade;

class AdminTest extends PHPUnit_Framework_TestCase
{
	/**
	 * @var Admin
	 */
	protected $admin;
	/**
	 * @var \Mockery\Mock
	 */
	protected $htmlBuilder;
	/**
	 * @var \Mockery\Mock
	 */
	protected $illuminateRouter;
	/**
	 * @var \Mockery\Mock
	 */
	protected $urlGenerator;

	protected function setUp()
	{
		parent::setUp();

		$app = Mockery::mock('\Illuminate\Foundation\Application');;
		$app->shouldReceive('make')->with('path');
		Facade::setFacadeApplication($app);

		Mockery::mock('\Illuminate\Html\HtmlBuilder');
		Mockery::mock('\Illuminate\Html\FormBuilder');
		$this->htmlBuilder = Mockery::mock('\SleepingOwl\Html\HtmlBuilder');
		$formBuilder = Mockery::mock('\SleepingOwl\Html\FormBuilder');
		$finder = Mockery::mock('\Symfony\Component\Finder\Finder');
		$config = Mockery::mock('\Illuminate\Config\Repository');
		$this->illuminateRouter = Mockery::mock('\Illuminate\Routing\Router');
		$this->urlGenerator = Mockery::mock('\Illuminate\Routing\UrlGenerator');
		$filesystem = Mockery::mock('\Illuminate\Filesystem\Filesystem');

		$this->htmlBuilder->shouldReceive('tag')->andReturnUsing(function ($tag, $attributes = null, $content = null)
		{
			return '<' . $tag . '>' . $content . '</' . $tag . '>';
		});

		$config->shouldReceive('get')->with('imagecache::route')->andReturn('img/cache');
		$config->shouldReceive('get')->with('admin::title')->andReturn('admin title');
		$config->shouldReceive('get')->with('admin::index')->andReturn(null);
		$config->shouldReceive('get')->with('admin::prefix')->andReturn('test_admin');
		$config->shouldReceive('get')->with('admin::bootstrapDirectory')->andReturn('admin');

		$finder->shouldReceive('create')->andReturnSelf();
		$finder->shouldReceive('files')->andReturnSelf();
		$finder->shouldReceive('name')->andReturnSelf();
		$finder->shouldReceive('in')->andReturnSelf();
		$finder->shouldReceive('sort');
		$finder->shouldReceive('getIterator')->andReturnUsing(function ()
		{
			return new ArrayIterator(['file.php']);
		});

		$filesystem->shouldReceive('requireOnce');
		$filesystem->shouldReceive('isDirectory')->andReturn(true);

		$this->urlGenerator->shouldReceive('route')->with('sleeping-owl-admin.home')->andReturn('route-home');
		$this->urlGenerator->shouldReceive('route')->with('sleeping-owl-admin.wildcard', Mockery::any())->andReturn('route-wildcard');
		$this->urlGenerator->shouldReceive('route')->with('sleeping-owl-admin.table.table', ['menu_item_test_models'])->andReturn('route-to-model');

		$app->shouldReceive('make')->with('\SleepingOwl\Admin\Admin')->andReturnUsing(function () use (
			$formBuilder, $finder, $config, $filesystem
		)
		{
			return new Admin($this->htmlBuilder, $formBuilder, $finder, $config, $this->illuminateRouter, $this->urlGenerator, $filesystem);
		});
		$this->admin = Admin::instance();
	}

	/** @test */
	public function it_initializes()
	{
		$this->assertInstanceOf('\SleepingOwl\Admin\Admin', $this->admin);
	}

	/** @test */
	public function it_creates_model_item()
	{
		$model = Admin::model('\Foo\Bar\Model');
		$this->assertInstanceOf('\SleepingOwl\Admin\Models\ModelItem', $model);
	}

	/** @test */
	public function it_creates_menu_item()
	{
		$menu = Admin::menu('\Foo\Bar\Model');
		$this->assertInstanceOf('\SleepingOwl\Admin\Menu\MenuItem', $menu);
	}

}
 