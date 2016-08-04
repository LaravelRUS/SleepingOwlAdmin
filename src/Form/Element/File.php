<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Routing\Router;
use SleepingOwl\Admin\Http\Controllers\FileElementController;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;

class File extends NamedFormElement implements WithRoutesInterface
{
    /**
     * @param Router $router
     */
    public static function registerRoutes(Router $router)
    {
        $routeName = 'admin.form.element.file';

        if ($router->has($routeName)) {
            return;
        }

        $router->post('upload/element/{type}')
            ->name($routeName)
            ->uses(FileElementController::class . '@file');
    }
}
