<?php

return [
	/*
	 * Admin title
	 * Displays in page title and header
	 */
	'title'                   => 'Sleeping Owl administrator',

	/*
	 * Admin url prefix
	 */
	'prefix'                  => 'admin',

	/*
	 * Middleware to use in admin routes
	 */
	'middleware'              => ['admin.auth'],

	/*
	 * Path to admin bootstrap files directory in app directory
	 * Default: 'app/admin'
	 */
	'bootstrapDirectory'      => app_path('admin'),

	/*
	 * Directory to upload images to (relative to public directory)
	 */
	'imagesUploadDirectory' => 'images/uploads',

	/*
	 * Authentication config
	 */
	'auth'                    => [
		'model' => '\SleepingOwl\AdminAuth\Entities\Administrator',
		'rules' => [
			'username' => 'required',
			'password' => 'required',
		]
	],

	/*
	 * Template to use
	 */
	'template'                => 'SleepingOwl\Admin\Templates\TemplateDefault',

	/*
	 * Default date and time formats
	 */
	'datetimeFormat'          => 'd.m.Y H:i',
	'dateFormat'              => 'd.m.Y',
	'timeFormat'              => 'H:i',
];
