<?php

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

Route::get('js/lang', [
	'as'   => 'admin.lang',
	'uses' => 'AdminController@getLang',
]);

Route::get('{adminWildcard}', [
	'as'   => 'admin.wildcard',
	'uses' => 'AdminController@getWildcard'
]);
