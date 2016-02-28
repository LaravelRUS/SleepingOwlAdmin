<?php

namespace SleepingOwl\Admin;

use BadMethodCallException;

class AliasBinder
{
    /**
     * @var array
     */
    protected $aliases = [];

    /**
     * Register new alias.
     *
     * @param string $alias
     * @param string $class
     */
    public function register($alias, $class)
    {
        $this->aliases[$alias] = $class;

        app('router')->group(
            ['prefix' => config('sleeping_owl.url_prefix'), 'middleware' => config('sleeping_owl.middleware')],
            function () use ($class) {

                if (method_exists($class, 'registerRoutes')) {
                    call_user_func([$class, 'registerRoutes']);
                }

            }
        );
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
