<?php

namespace SleepingOwl\Admin;

use BadMethodCallException;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\Registrar;
use ReflectionClass;
use SleepingOwl\Admin\Contracts\AliasBinderInterface;

class AliasBinder implements AliasBinderInterface
{
    /**
     * @var array
     */
    protected static $routes = [];

    /**
     * @param  \Illuminate\Contracts\Routing\Registrar  $router
     * @return void
     */
    public static function registerRoutes(Registrar $router)
    {
        foreach (self::$routes as $i => $route) {
            call_user_func($route, $router);
            unset(self::$routes[$i]);
        }
    }

    /**
     * @var \Illuminate\Contracts\Foundation\Application
     */
    protected $app;

    /**
     * AliasBinder constructor.
     *
     * @param  \Illuminate\Contracts\Foundation\Application  $application
     */
    public function __construct(Application $application)
    {
        $this->app = $application;
    }

    /**
     * @var array
     */
    protected $aliases = [];

    /**
     * Bind new alias.
     *
     * @param  string  $alias
     * @param  string  $class
     * @return $this
     */
    public function bind($alias, $class)
    {
        $this->aliases[$alias] = $class;

        if (method_exists($class, 'registerRoutes')) {
            self::$routes[] = [$class, 'registerRoutes'];
        }

        return $this;
    }

    /**
     * @param  string  $alias
     * @param  string  $class
     * @return $this
     *
     * @deprecated Use `bind` method
     */
    public function add($alias, $class)
    {
        return $this->bind($alias, $class);
    }

    /**
     * @param  array  $classes
     * @return $this
     */
    public function register(array $classes)
    {
        foreach ($classes as $alias => $class) {
            $this->bind($alias, $class);
        }

        return $this;
    }

    /**
     * @return array
     */
    public function getAliases()
    {
        return $this->aliases;
    }

    /**
     * Get class by alias.
     *
     * @param  string  $alias
     * @return string
     */
    public function getAlias($alias)
    {
        return $this->aliases[$alias];
    }

    /**
     * Check if alias is registered.
     *
     * @param  string  $alias
     * @return bool
     */
    public function hasAlias($alias)
    {
        return array_key_exists($alias, $this->aliases);
    }

    /**
     * @param  string  $alias
     * @param  array  $arguments
     * @return object
     *
     * @throws \ReflectionException
     */
    public function makeClass($alias, array $arguments)
    {
        $reflection = new ReflectionClass($this->getAlias($alias));

        return $reflection->newInstanceArgs($arguments);
    }

    /**
     * @param $name
     * @param $arguments
     * @return object
     *
     * @throws \ReflectionException
     */
    public function __call($name, $arguments)
    {
        if (! $this->hasAlias($name)) {
            throw new BadMethodCallException($name);
        }

        return $this->makeClass($name, $arguments);
    }
}
