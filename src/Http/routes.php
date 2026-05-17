<?php

use Illuminate\Routing\Router;
use SleepingOwl\Admin\Http\Controllers\AdminController;

$router->group(['as' => 'admin.', 'namespace' => 'SleepingOwl\Admin\Http\Controllers'], function (Router $router) {
    if (! $router->has('admin.dashboard')) {
        $router->get('', [AdminController::class, 'getDashboard'])->name('dashboard');
    }

    $router->get('{adminModel}', [AdminController::class, 'getDisplay'])->name('model');

    $router->post('{adminModel}', [AdminController::class, 'inlineEdit']);

    $router->get('{adminModel}/create', [AdminController::class, 'getCreate'])->name('model.create');

    $router->post('{adminModel}/create', [AdminController::class, 'postStore'])->name('model.store');

    $router->get('{adminModel}/{adminModelId?}/edit', [AdminController::class, 'getEdit'])->name('model.edit');

    $router->post('{adminModel}/{adminModelId?}/edit', [AdminController::class, 'postUpdate'])->name('model.update');

    $router->delete('{adminModel}/{adminModelId?}/delete', [AdminController::class, 'deleteDelete'])->name('model.delete');

    $router->delete('{adminModel}/{adminModelId?}/destroy', [AdminController::class, 'deleteDestroy'])->name('model.destroy');

    $router->post('{adminModel}/{adminModelId?}/restore', [AdminController::class, 'postRestore'])->name('model.restore');

    $router->get('{adminWildcard}', [AdminController::class, 'getWildcard'])->name('wildcard');

    $router->post('{adminModel}/deletedAll', [AdminController::class, 'deletedAll'])->name('deletedAll');

    if (config('sleeping_owl.enable_editor')) {
        $router->group(['middleware' => config('sleeping_owl.env_editor_middlewares')], function (Router $router) {
            $router->get(config('sleeping_owl.env_editor_url'), [AdminController::class, 'getEnvEditor'])->name('env.editor');
            $router->post(config('sleeping_owl.env_editor_url'), [AdminController::class, 'postEnvEditor'])->name('env.editor.post');
        });
    }
});
