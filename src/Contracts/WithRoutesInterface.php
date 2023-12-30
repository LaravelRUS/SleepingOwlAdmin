<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Routing\Router;

interface WithRoutesInterface
{
    /**
     * @param  Router  $router
     * @return void
     */
    public static function registerRoutes(Router $router);
}
