<?php

namespace SleepingOwl\Admin\Http;

use Illuminate\Routing\Router as IlluminateRouter;
use SleepingOwl\Admin\Contracts\RouterInterface;

class Router implements RouterInterface
{
    /**
     * @var IlluminateRouter
     */
    protected $router;

    /**
     * @var string
     */
    protected $urlPrefix;

    /**
     * @var string
     */
    protected $middleware;

    /**
     * Router constructor.
     *
     * @param IlluminateRouter $router
     * @param string $urlPrefix
     * @param string $middleware
     */
    public function __construct(IlluminateRouter $router, $urlPrefix, $middleware)
    {
        $this->router = $router;
        $this->urlPrefix = $urlPrefix;
        $this->middleware = $middleware;
    }

    /**
     * Register admin routes.
     *
     * @param \Closure $closure
     */
    public function register(\Closure $closure)
    {
        $this->router->group([
            'prefix' => $this->urlPrefix,
            'middleware' => $this->middleware,
        ], $closure);
    }
}
