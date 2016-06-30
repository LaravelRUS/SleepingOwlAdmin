<?php

namespace SleepingOwl\Admin;

use BadMethodCallException;

class AliasBinder
{
    /**
     * @var array
     */
    protected static $routes = [];

    /**
     * @return array
     */
    public static function routes()
    {
        return self::$routes;
    }

    /**
     * @var array
     */
    protected $aliases = [];

    /**
     * Register new alias.
     *
     * @param string $alias
     * @param string $class
     *
     * @return $this
     */
    public function add($alias, $class)
    {
        $this->aliases[$alias] = $class;

        if (method_exists($class, 'registerRoutes')) {
            self::$routes[] = [$class, 'registerRoutes'];
        }

        return $this;
    }

    /**
     * @param array $classes
     *
     * @return $this
     */
    public function register(array $classes)
    {
        foreach ($classes as $key => $class) {
            $this->add($key, $class);
        }

        return $this;
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

        return app($this->getAlias($name), $arguments);
    }
}
