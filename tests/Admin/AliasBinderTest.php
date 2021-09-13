<?php

use Mockery as m;
use SleepingOwl\Admin\AliasBinder;

class AliasBinderTest extends TestCase
{
    /**
     * @var SleepingOwl\Admin\AliasBinder
     */
    private $binder;

    public function setUp(): void
    {
        parent::setUp();

        $this->binder = new AliasBinder(
            $this->app
        );
    }

    /**
     * @covers SleepingOwl\Admin\AliasBinder::bind
     * @covers SleepingOwl\Admin\AliasBinder::getAlias
     * @covers SleepingOwl\Admin\AliasBinder::hasAlias
     * @covers SleepingOwl\Admin\AliasBinder::hasAlias
     */
    public function test_binds_and_gets_alias()
    {
        $this->assertEquals($this->binder, $this->binder->bind('test', $class = AliasBinderTestWithoutRoutes::class));
        $this->assertEquals($class, $this->binder->getAlias('test'));
        $this->assertTrue($this->binder->hasAlias('test'));
        $this->assertFalse($this->binder->hasAlias('test1'));

        $this->assertArrayHasKey('test', $this->binder->getAliases());
        $this->assertCount(1, $this->binder->getAliases());
    }

    /**
     * @covers \SleepingOwl\Admin\AliasBinder::register
     */
    public function test_register_aliases()
    {
        $this->assertEquals($this->binder, $this->binder->register([
            'test' => $class = AliasBinderTestWithoutRoutes::class,
        ]));

        $this->assertTrue($this->binder->hasAlias('test'));
    }

    public function test_bind_alias_with_routes()
    {
        $this->binder->bind('test', $class = AliasBinderTestWithRoutes::class);

        $router = m::mock(\Illuminate\Routing\Router::class);
        $router->shouldReceive('get')->once();

        AliasBinder::registerRoutes($router);
    }

    public function test_makes_class()
    {
        $this->binder->bind('test', $class = AliasBinderTestWithoutRoutes::class);

        $this->assertInstanceOf(
            AliasBinderTestWithoutRoutes::class,
            $this->binder->makeClass('test', [])
        );
    }

    public function test_makes_class_with_call()
    {
        $this->binder->bind('test', $class = AliasBinderTestWithoutRoutes::class);

        $this->assertInstanceOf(
            AliasBinderTestWithoutRoutes::class,
            $this->binder->test()
        );
    }
}

class AliasBinderTestWithoutRoutes
{
}

class AliasBinderTestWithRoutes implements \SleepingOwl\Admin\Contracts\WithRoutesInterface
{
    /**
     * @param  \Illuminate\Routing\Router  $router
     * @return void
     */
    public static function registerRoutes(\Illuminate\Routing\Router $router)
    {
        $router->get('test');
    }
}
