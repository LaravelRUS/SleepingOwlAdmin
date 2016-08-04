<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Routing\Router;

interface WithRoutesInterface
{
    /**
     * Register router.
     *
     * @param Router $router
     */
    public static function registerRoutes(Router $router);
}
