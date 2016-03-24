![bg](https://cloud.githubusercontent.com/assets/773481/14028746/24d7efa8-f20f-11e5-8e38-3d264739f0aa.png)

## Laravel 5.2 Admin Module

[![StyleCI](https://styleci.io/repos/52141393/shield?style=flat)](https://styleci.io/repos/52141393)
[![Join the chat at https://gitter.im/LaravelRUS/SleepingOwlAdmin](https://badges.gitter.im/LaravelRUS/SleepingOwlAdmin.svg)](https://gitter.im/LaravelRUS/SleepingOwlAdmin?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Latest Stable Version](https://poser.pugx.org/sleeping-owl/admin/v/unstable.svg)](https://packagist.org/packages/laravelrus/sleepingowl)
[![License](https://poser.pugx.org/laravelrus/sleepingowl/license.svg)](https://packagist.org/packages/laravelrus/sleepingowl)

*Note: this is development version. If you are looking for stable version check out [master branch](https://github.com/LaravelRUS/SleepingOwlAdmin).*

SleepingOwl Admin is administrative interface builder for Laravel.

### Used bower packages:
 - jquery
 - bootstrap
 - bootbox
 - datetimepicker
 - fontawesome
 - moment
 - nestable
 - noty
 - ckeditor
 - Sortable
 - select2
 - flow.js
 - ekko-lightbox
 - metisMenu
 - datatables
 - startbootstrap-sb-admin-2

## Installation

 1. Require this package in your composer.json and run composer update:

		"laravelrus/sleepingowl": "4.*@dev"

 2. After composer update, insert service provider `SleepingOwl\Admin\Providers\SleepingOwlServiceProvider::class,`
 before `Application Service Providers...` to the `config/app.php`

**Example**
```php
		...
		/*
		 * SleepingOwl Service Provider
		 */
	    SleepingOwl\Admin\Providers\SleepingOwlServiceProvider::class,

	    /*
		 * Application Service Providers...
		 */
 		App\Providers\AppServiceProvider::class,
 		...
```

 3. Run this command in terminal (if you want to know what exactly this command makes, see [install command documentation](http://sleeping-owl.github.io/en/Commands/Install.html)):

		$ php artisan sleepingowl:install


## Upgrade from 4.18.x to 4.19.x

### HtmlAttributes
Class has been moved to composer package `kodicomponents\support` for using in other projects and methods have been changed for more compatibility.

- `setAttribute` -> `setHtmlAttribute`
- `setAttributes` -> `setHtmlAttributes`
- `getAttribute` -> `getHtmlAttribute`
- `getAttributes` -> `getHtmlAttributes`
- `hasAttribute` -> `hasHtmlAttribute`
- `replaceAttribute` -> `replaceHtmlAttribute`
- `removeAttribute` -> `removeHtmlAttribute`
- `clearAttributes` -> `clearHtmlAttributes`
- `hasClass` -> `hasClassProperty`

### Navigation
Navigation classes have been move to composer package `kodicomponents\navigation` for using in other projects

## Authentication
By default admin module use Laravel authentication.

If you want to use auth, you can run artisan command `php artisan make:auth` (https://laravel.com/docs/5.2/authentication) and append middleware `auth` to `config/sleeping_owl.php`

### Supporting of old authentication

If you want to migrate from old version< you can use old auth.

Steps:

1. Add new user provider in `config/auth.php`

```php
	'providers' => [
		'users' => [
			'driver' => 'eloquent',
			'model' => App\User::class,
		],
		'administrators' => [
			'driver' => 'eloquent',
			'model' => SleepingOwl\Admin\Auth\Administrator::class,
		],
	],
```

2. Add new guards or change existing in `config/auth.php`

```php
	'guards' => [
		'web' => [
			'driver' => 'session',
			'provider' => 'administrators', // change existing provider
		],
		
		// or add new
		
		'admin' => [
			'driver' => 'session',
			'provider' => 'administrators',
		],
	],
```

3. Setting up middleware

By default `auth` middleware use default guard, selected in `config/auth.php`

```php
	'defaults' => [
		'guard' => 'web', <- default
		...
	],
```

You can change default guard to `admin` or change middleware in `config/sleeping_owl.php` to

```php
	'middleware' => ['web', 'auth:admin'],
```

## Demo project

You can download demo project https://github.com/SleepingOwlAdmin/demo

## Documentation

Documentation can be found at [sleeping owl documentation](http://sleeping-owl.github.io/v4).

## Copyright and License

Admin was written by Sleeping Owl for the Laravel framework and is released under the MIT License. See the LICENSE file for details.
