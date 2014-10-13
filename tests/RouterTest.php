<?php

use SleepingOwl\Admin\Router;

class RouterTest extends \PHPUnit_Framework_TestCase
{
	/**
	 * @var Router
	 */
	protected $instance;

	/**
	 * @var \Mockery\MockInterface
	 */
	protected $router;
	/**
	 * @var \Mockery\MockInterface
	 */
	protected $urlGenerator;

	public function setUp()
	{
		parent::setUp();
		$this->router = Mockery::mock('Illuminate\Routing\Router');
		$this->router->shouldReceive('where')->andReturnSelf();

		$config = Mockery::mock('Illuminate\Config\Repository');
		$this->urlGenerator = Mockery::mock('Illuminate\Routing\UrlGenerator');
		$config->shouldReceive('get')->with('admin::beforeFilters')->andReturn(['before-filter']);
		$config->shouldReceive('get')->with('imagecache::route')->andReturn('img/cache');
		$this->instance = new Router($this->router, $config, $this->urlGenerator, 'admin_test', 'test-prefix');
	}

	protected function shouldReceiveAnyOther()
	{
		$this->router->shouldReceive('group')->withAnyArgs()->andReturnUsing(function ($arr, $callback)
		{
			call_user_func($callback);
		});
		$this->router->shouldReceive('get')->withAnyArgs()->andReturn($this->router);
		$this->router->shouldReceive('post')->withAnyArgs()->andReturn($this->router);
		$this->router->shouldReceive('put')->withAnyArgs()->andReturn($this->router);
		$this->router->shouldReceive('delete')->withAnyArgs()->andReturn($this->router);
		$this->router->shouldReceive('patch')->withAnyArgs()->andReturn($this->router);
		$this->router->shouldReceive('before')->withAnyArgs()->andReturn($this->router);
	}

	/** @test */
	public function it_initializes()
	{
		$this->assertInstanceOf('SleepingOwl\Admin\Router', $this->instance);
	}

	/** @test */
	public function it_registers_images_routes()
	{
		$this->router->shouldReceive('get')->with('all', 'ImagesController@getAll')->once();
		$this->router->shouldReceive('post')->with('upload', 'ImagesController@postUpload')->once();
		$this->router->shouldReceive('get')->with('js/{locale}/lang.js', Mockery::any())->once();
		$this->shouldReceiveAnyOther();
		$this->instance->registerRoutes();
	}

	/** @test */
	public function it_registers_auth_routes()
	{
		$this->router->shouldReceive('get')->with('login', [
			'as'   => 'test-prefix.login',
			'uses' => 'AuthController@getLogin'
		])->once();
		$this->router->shouldReceive('post')->with('login', [
			'as'   => 'test-prefix.login.post',
			'uses' => 'AuthController@postLogin'
		])->once()->andReturn($this->router);
		$this->router->shouldReceive('get')->with('logout', [
			'as'   => 'test-prefix.logout',
			'uses' => 'AuthController@getLogout'
		])->once();
		$this->shouldReceiveAnyOther();
		$this->instance->registerRoutes();
	}

	/** @test */
	public function it_registers_model_routes()
	{
		$modelRoutes = [
			[
				'url'    => '{model}',
				'action' => 'table',
				'method' => 'get'
			],
			[
				'url'    => '{model}/create',
				'action' => 'create',
				'method' => 'get'
			],
			[
				'url'    => '{model}',
				'action' => 'store',
				'method' => 'post'
			],
			[
				'url'    => '{model}/{id}/edit',
				'action' => 'edit',
				'method' => 'get'
			],
			[
				'url'    => '{model}/{id}/update',
				'action' => 'update',
				'method' => 'put'
			],
			[
				'url'    => '{model}/{id}',
				'action' => 'destroy',
				'method' => 'delete'
			],
			[
				'url'    => '{model}/{id}/moveup',
				'action' => 'moveup',
				'method' => 'patch'
			],
			[
				'url'    => '{model}/{id}/movedown',
				'action' => 'movedown',
				'method' => 'patch'
			],
		];
		foreach ($modelRoutes as $route)
		{
			$action = $route['action'];
			$this->router->shouldReceive($route['method'])->with($route['url'], [
				'as'   => 'test-prefix.table.' . $action,
				'uses' => 'AdminController@' . $action
			])->once();
		}
		$this->shouldReceiveAnyOther();
		$this->instance->registerRoutes();
	}

	/** @test */
	public function it_generates_url_to_asset()
	{
		$this->shouldReceiveAnyOther();
		$this->instance->registerRoutes();

		$this->urlGenerator->shouldReceive('asset')->with('packages/sleeping-owl/admin/min.js')->once()->andReturn('some-route');
		$this->urlGenerator->shouldReceive('asset')->with('packages/sleeping-owl/admin/subdir/min.css')->once()->andReturn('some-route');

		$route = $this->instance->routeToAsset('min.js');
		$this->assertEquals('some-route', $route);

		$route = $this->instance->routeToAsset('subdir/min.css');
		$this->assertEquals('some-route', $route);
	}

	/** @test */
	public function it_generates_url_to_model_table()
	{
		$this->shouldReceiveAnyOther();
		$this->instance->registerRoutes();

		$this->urlGenerator->shouldReceive('route')->with('test-prefix.table.table', ['TestModel'])->once()->andReturn('some-route');
		$this->urlGenerator->shouldReceive('route')->with('test-prefix.table.table', [
			'TestModel',
			'test_parameter' => 2,
			'parameter_without_value'
		])->once()->andReturn('some-route');

		$route = $this->instance->routeToModel('TestModel');
		$this->assertEquals('some-route', $route);

		$route = $this->instance->routeToModel('TestModel', [
			'test_parameter' => 2,
			'parameter_without_value'
		]);
		$this->assertEquals('some-route', $route);
	}

	/** @test */
	public function it_generates_url_to_auth()
	{
		$this->shouldReceiveAnyOther();
		$this->instance->registerRoutes();

		$this->urlGenerator->shouldReceive('route')->with('test-prefix.login')->once()->andReturn('some-route');
		$this->urlGenerator->shouldReceive('route')->with('test-prefix.login.post')->once()->andReturn('some-route');
		$this->urlGenerator->shouldReceive('route')->with('test-prefix.logout')->once()->andReturn('some-route');

		$route = $this->instance->routeToAuth('login');
		$this->assertEquals('some-route', $route);

		$route = $this->instance->routeToAuth('login.post');
		$this->assertEquals('some-route', $route);

		$route = $this->instance->routeToAuth('logout');
		$this->assertEquals('some-route', $route);
	}

	/** @test */
	public function it_generates_urls_to_model()
	{
		$this->shouldReceiveAnyOther();
		$this->instance->registerRoutes();

		$methods = [
			'table',
			'create',
			'store',
			'edit',
			'update',
			'destroy',
			'moveup',
			'movedown'
		];
		foreach ($methods as $method)
		{
			$this->urlGenerator->shouldReceive('route')->with('test-prefix.table.' . $method, ['TestModel'])->once()->andReturn('some-route');

			$methodName = 'routeTo' . ucfirst($method);
			$route = $this->instance->$methodName('TestModel');
			$this->assertEquals('some-route', $route);
		}
	}

	/** @test */
	public function it_accepts_second_argument_as_not_array_in_routeTo_method()
	{
		$this->urlGenerator->shouldReceive('route')->with('test-prefix.table.edit', ['TestModel', 1])->once()->andReturn('some-route');

		$route = $this->instance->routeToEdit('TestModel', 1);
		$this->assertEquals('some-route', $route);
	}

	/** @test */
	public function it_generates_url_to_lang_js()
	{
		$this->urlGenerator->shouldReceive('route')->with('test-prefix.lang', 'en')->once()->andReturn('some-route');

		$route = $this->instance->routeToLang('en');
		$this->assertEquals('some-route', $route);
	}

	/** @test */
	public function it_throws_an_exception_when_unknown_method_called()
	{
		$this->setExpectedException(\SleepingOwl\Admin\Exceptions\MethodNotFoundException::class);

		$route = $this->instance->unknownMethod();
		$this->assertEquals('some-route', $route);
	}

}
 