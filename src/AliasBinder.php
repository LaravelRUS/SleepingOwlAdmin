<?php

namespace SleepingOwl\Admin;

use BadMethodCallException;
use Illuminate\Contracts\Foundation\Application;
use SleepingOwl\Admin\Display\DisplayTab;

class AliasBinder
{
    /**
     * @var array
     */
    protected static $routes = [];

    /**
     * @var Application
     */
    private $app;

    /**
     * AliasBinder constructor.
     *
     * @param Application $application
     */
    public function __construct(Application $application)
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
        $deps = array_slice(array_reverse($constructor->getParameters()), -$totalArguments, $totalArguments, true);

        foreach ($deps as $parameter) {
            if (! is_null($parameter->getClass())) {
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
