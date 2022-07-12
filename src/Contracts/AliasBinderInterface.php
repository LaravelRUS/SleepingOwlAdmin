<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Contracts\Routing\Registrar;

interface AliasBinderInterface
{
    /**
     * @param Registrar $router
     * @return void
     */
    public static function registerRoutes(Registrar $router);

    /**
     * Bind new alias.
     *
     * @param string $alias
     * @param string $class
     * @return $this
     */
    public function bind(string $alias, string $class): AliasBinderInterface;

    /**
     * @param  array  $classes
     * @return $this
     */
    public function register(array $classes): AliasBinderInterface;

    /**
     * @return array
     */
    public function getAliases(): array;

    /**
     * Get class name by alias.
     *
     * @param string $alias
     * @return string
     */
    public function getAlias(string $alias): string;

    /**
     * Check if alias is registered.
     *
     * @param string $alias
     * @return bool
     */
    public function hasAlias(string $alias): bool;

    /**
     * @param string $alias
     * @param  array  $arguments
     * @return object
     */
    public function makeClass(string $alias, array $arguments): object;

}
