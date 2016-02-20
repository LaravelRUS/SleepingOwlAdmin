<?php

Route::get('assets/admin.scripts', [
    'as'   => 'admin.lang',
    'uses' => 'AdminController@getLang',
]);

Route::group(['as' => 'admin.'], function () {
    Route::get('{adminModel}', [
        'as'   => 'model',
        'uses' => 'AdminController@getDisplay',
    ]);

    Route::get('{adminModel}/create', [
        'as'   => 'model.create',
        'uses' => 'AdminController@getCreate',
    ]);

    Route::post('{adminModel}/create', [
        'as'   => 'model.store',
        'uses' => 'AdminController@postStore',
    ]);

    Route::get('{adminModel}/{adminModelId}/edit', [
        'as'   => 'model.edit',
        'uses' => 'AdminController@getEdit',
    ]);

    Route::post('{adminModel}/{adminModelId}/edit', [
        'as'   => 'model.update',
        'uses' => 'AdminController@postUpdate',
    ]);

    Route::delete('{adminModel}/{adminModelId}/delete', [
        'as'   => 'model.destroy',
        'uses' => 'AdminController@postDestroy',
    ]);

    Route::post('{adminModel}/{adminModelId}/restore', [
        'as'   => 'model.restore',
        'uses' => 'AdminController@postRestore',
    ]);

    Route::get('{adminWildcard}', [
        'as'   => 'wildcard',
        'uses' => 'AdminController@getWildcard',
    ]);
});
