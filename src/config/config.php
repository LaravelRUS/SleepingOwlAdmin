<?php

return [
	/*
	 * Admin title
	 * Displays in page title and header
	 */
	'title'                 => 'Sleeping Owl administrator',

	/*
	 * Admin url prefix
	 */
	'prefix'                => 'admin',

	'middleware'            => ['admin.auth'],

	/*
	 * Path to admin bootstrap files directory in app directory
	 * Default: 'app/admin'
	 */
	'bootstrapDirectory'    => app_path('admin'),

	/*
	 * Path to images directory
	 * Default: 'public/images'
	 */
	'imagesDirectory'       => 'images',

	/*
	 * Path to files directory
 	 * Default: 'public/files'
 	 */
	'filesDirectory'        => 'files',

	/*
	 * Path to images upload directory within 'imagesDirectory'
	 * Default: 'uploads'
	 */
	'imagesUploadDirectory' => 'uploads',

	/*
	 * Authentication config
	 */
	'auth'                  => [
		'model' => '\SleepingOwl\AdminAuth\Entities\Administrator',
		'rules' => [
			'username' => 'required',
			'password' => 'required',
		]
	],

	'template'              => 'SleepingOwl\Admin\Templates\TemplateDefault',

	'datetime_format'       => 'd.m.Y H:i:s',
];
