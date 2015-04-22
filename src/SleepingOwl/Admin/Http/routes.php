<?php

Route::get('login', [
	'as'   => 'admin.login',
	'uses' => 'AuthController@getLogin',
]);

Route::post('login', [
	'as'   => 'admin.login.post',
	'uses' => 'AuthController@postLogin',
]);

Route::get('assets/lang', [
	'as'   => 'admin.lang',
	'uses' => 'AdminController@getLang',
]);

Route::group([
	'middleware' => config('admin.middleware'),
], function ()
{
	Route::get('logout', [
		'as'   => 'admin.logout',
		'uses' => 'AuthController@getLogout',
	]);

	Route::get('{adminModel}', [
		'as'   => 'admin.model',
		'uses' => 'AdminController@getDisplay'
	]);

	Route::get('{adminModel}/create', [
		'as'   => 'admin.model.create',
		'uses' => 'AdminController@getCreate',
	]);

	Route::post('{adminModel}', [
		'as'   => 'admin.model.store',
		'uses' => 'AdminController@postStore',
	]);

	Route::get('{adminModel}/{adminModelId}/edit', [
		'as'   => 'admin.model.edit',
		'uses' => 'AdminController@getEdit',
	]);

	Route::post('{adminModel}/{adminModelId}', [
		'as'   => 'admin.model.update',
		'uses' => 'AdminController@postUpdate',
	]);

	Route::delete('{adminModel}/{adminModelId}', [
		'as'   => 'admin.model.destroy',
		'uses' => 'AdminController@postDestroy',
	]);

	Route::post('{adminModel}/{adminModelId}/restore', [
		'as'   => 'admin.model.restore',
		'uses' => 'AdminController@postRestore',
	]);

	Route::get('{adminWildcard}', [
		'as'   => 'admin.wildcard',
		'uses' => 'AdminController@getWildcard'
	]);
});