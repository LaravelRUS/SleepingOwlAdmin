<?php

namespace SleepingOwl\Admin;

use BadMethodCallException;
use SleepingOwl\Admin\Contracts\AliasBinderInterface;

class AliasBinder implements AliasBinderInterface
{
    /**
     * @var array
     */
    protected static $routes = [];

    /**
     * @param \Illuminate\Contracts\Routing\Registrar $router
     *
     * @return void
     */
    public static function registerRoutes(\Illuminate\Contracts\Routing\Registrar $router)
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
     * @param \Illuminate\Contracts\Foundation\Application $application
     */
    public function __construct(\Illuminate\Contracts\Foundation\Application $application)
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
     * @param string $alias
     * @param string $class
     *
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
     * @param string $alias
     * @param string $class
     *
     * @return $this
     *
     * @deprecated Use `bind` method
     */
    public function add($alias, $class)
    {
        return $this->bind($alias, $class);
    }

    /**
     * @param array $classes
     *
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
     * @param string $alias
     *
     * @return string
     */
    public function getAlias($alias)
    {
        return $this->aliases[$alias];
    }

    /**
     * Check if alias is registered.
     *
     * @param string $alias
     *
     * @return bool
     */
    public function hasAlias($alias)
    {
        return array_key_exists($alias, $this->aliases);
    }

    /**
     * @param string $alias
     * @param array $arguments
     *
     * @return object
     */
    public function makeClass($alias, array $arguments)
    {
        return $this->app->make($this->getAlias($alias), $arguments);
    }

    /**
     * Create new instance by alias.
     *
     * @param string $name
     * @param        $arguments
     *
     * @return mixed
     */
    public function __call($name, $arguments)
    {
        if (! $this->hasAlias($name)) {
            throw new BadMethodCallException($name);
        }

        return $this->makeClass($name, $arguments);
    }
}
