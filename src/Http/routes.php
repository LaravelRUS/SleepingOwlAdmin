<?php

use Illuminate\Routing\Router;

$router->group(['as' => 'admin.', 'namespace' => 'SleepingOwl\Admin\Http\Controllers'], function (Router $router) {
    if (! $router->has('admin.dashboard')) {
        $router->get('', ['as' => 'dashboard', 'uses' => 'AdminController@getDashboard']);
    }

    $router->get('{adminModel}', [
        'as' => 'model',
        'uses' => 'AdminController@getDisplay',
    ]);

    $router->post('{adminModel}', [
        'uses' => 'AdminController@inlineEdit',
    ]);

    $router->get('{adminModel}/create', [
        'as' => 'model.create',
        'uses' => 'AdminController@getCreate',
    ]);

    $router->post('{adminModel}/create', [
        'as' => 'model.store',
        'uses' => 'AdminController@postStore',
    ]);

    $router->get('{adminModel}/{adminModelId?}/edit', [
        'as' => 'model.edit',
        'uses' => 'AdminController@getEdit',
    ]);

    $router->post('{adminModel}/{adminModelId?}/edit', [
        'as' => 'model.update',
        'uses' => 'AdminController@postUpdate',
    ]);

    $router->delete('{adminModel}/{adminModelId?}/delete', [
        'as' => 'model.delete',
        'uses' => 'AdminController@deleteDelete',
    ]);

    $router->delete('{adminModel}/{adminModelId?}/destroy', [
        'as' => 'model.destroy',
        'uses' => 'AdminController@deleteDestroy',
    ]);

    $router->post('{adminModel}/{adminModelId?}/restore', [
        'as' => 'model.restore',
        'uses' => 'AdminController@postRestore',
    ]);

    $router->get('{adminWildcard}', [
        'as' => 'wildcard',
        'uses' => 'AdminController@getWildcard',
    ]);

    $router->post('{adminModel}/deletedAll', [
        'as' => 'deletedAll',
        'uses' => 'AdminController@deletedAll',
    ]);

    if (config('sleeping_owl.enable_editor')) {
        $router->group(['middleware' => config('sleeping_owl.env_editor_middlewares')], function (Router $router) {
            $router->get(config('sleeping_owl.env_editor_url'), [
                'as' => 'env.editor',
                'uses' => 'AdminController@getEnvEditor',
            ]);
            $router->post(config('sleeping_owl.env_editor_url'), [
                'as' => 'env.editor.post',
                'uses' => 'AdminController@postEnvEditor',
            ]);
        });
    }
});
