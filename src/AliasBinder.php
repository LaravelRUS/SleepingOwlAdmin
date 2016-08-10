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
     * @var \Illuminate\Contracts\Foundation\Application
     */
    private $app;

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
     * @param string $alias
     * @param array $arguments
     *
     * @return object
     */
    public function makeClass($alias, array $arguments)
    {
        $class = $this->getAlias($alias);
        $reflector = new \ReflectionClass($class);
        $constructor = $reflector->getConstructor();

        $totalArguments = count($arguments);
        $deps = $constructor->getParameters();
        $deps = array_reverse(
            array_slice(
                $deps, 0, count($deps) - $totalArguments
            )
        );

        foreach ($deps as $parameter) {
            if (! is_null($parameter->getClass()) && $parameter->getClass()->name != 'Closure') {
                array_unshift($arguments, $this->app->make($parameter->getClass()->name));
            }
        }

        return $this->app->make($class, $arguments);
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
