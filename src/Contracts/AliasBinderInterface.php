<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Contracts\Routing\Registrar;

interface AliasBinderInterface
{
    /**
     * @param  \Illuminate\Contracts\Routing\Registrar  $router
     * @return void
     */
    public static function registerRoutes(Registrar $router);

    /**
     * Bind new alias.
     *
     * @param  string  $alias
     * @param  string  $class
     * @return $this
     */
    public function bind($alias, $class);

    /**
     * @param  array  $classes
     * @return $this
     */
    public function register(array $classes);

    /**
     * @return array
     */
    public function getAliases();

    /**
     * Get class name by alias.
     *
     * @param  string  $alias
     * @return string
     */
    public function getAlias($alias);

    /**
     * Check if alias is registered.
     *
     * @param  string  $alias
     * @return bool
     */
    public function hasAlias($alias);

    /**
     * @param  string  $alias
     * @param  array  $arguments
     * @return object
     */
    public function makeClass($alias, array $arguments);
}
