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


## Demo project

You can download demo project https://github.com/LaravelRUS/SleepingOwlAdminDemo

## Documentation

Documentation can be found at [sleeping owl documentation](http://sleeping-owl.github.io/v4).

## Copyright and License

Admin was written by Sleeping Owl for the Laravel framework and is released under the MIT License. See the LICENSE file for details.