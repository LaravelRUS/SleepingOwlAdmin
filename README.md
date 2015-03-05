## Laravel 5 Admin Module

[![Latest Stable Version](https://poser.pugx.org/sleeping-owl/admin/v/stable.svg)](https://packagist.org/packages/sleeping-owl/admin)
[![License](https://poser.pugx.org/sleeping-owl/admin/license.svg)](https://packagist.org/packages/sleeping-owl/admin)

*Note: if you are looking for the version for Laravel 4.2 check out [laravel-4.2 branch](https://github.com/sleeping-owl/admin/tree/laravel-4.2).*

SleepingOwl Admin is administrative interface builder for Laravel.

It includes:

 - [sb-admin-2 template](http://startbootstrap.com/template-overviews/sb-admin-2/)
 - [jQuery 1.11.0](http://jquery.org)
 - [Bootstrap v3.2.0](http://getbootstrap.com)
 - [Bootstrap Multiselect v0.9.8](https://github.com/davidstutz/bootstrap-multiselect)
 - [DataTables 1.10.0-dev](http://www.sprymedia.co.uk)
 - [Lightbox for Bootstrap 3](https://github.com/ashleydw/lightbox)
 - [Font Awesome 4.1.0](http://fontawesome.io)
 - [Metismenu 1.0.3](https://github.com/onokumus/metisMenu)
 - [morris.js v0.5.0]()
 - [bootbox.js v4.3.0](http://bootboxjs.com)
 - [Bootstrap datetimepicker](http://eonasdan.github.io/bootstrap-datetimepicker/)
 - [CKEditor](http://ckeditor.com)

## Installation

 1. Require this package in your composer.json and run composer update (or run `composer require sleeping-owl/admin:dev-laravel-5` directly):

		"sleeping-owl/admin": "2.*"

 2. After composer update, add service providers to the `config/app.php`

	    'SleepingOwl\Admin\AdminServiceProvider',
	    'Illuminate\Html\HtmlServiceProvider',

 3. Add this to the facades in `config/app.php`:

		'Admin'				=> 'SleepingOwl\Admin\Admin',
		'AdminAuth'			=> 'SleepingOwl\AdminAuth\Facades\AdminAuth',
		'AssetManager' 		=> 'SleepingOwl\Admin\AssetManager\AssetManager',
		'Column'   			=> 'SleepingOwl\Admin\Columns\Column',
		'FormItem' 			=> 'SleepingOwl\Admin\Models\Form\FormItem',
		'ModelItem'			=> 'SleepingOwl\Admin\Models\ModelItem',
		
		'Form'      => 'Illuminate\Html\FormFacade',
		'Html'      => 'Illuminate\Html\HtmlFacade',

 4. Run this command in terminal (if you want to know what exactly this command makes, see [install command documentation](http://sleeping-owl.github.io/en/Commands/Install.html)):

		$ php artisan admin:install

## Documentation

Documentation can be found at [sleeping owl documentation](http://sleeping-owl.github.io).
You can also find it in the `/src/docs` directory.

## Demo Application

View [live demo](http://sleepingowladmindemo.cloudcontrolled.com).

## Support Library

You can donate via [PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=AXJMWMRPCBGVA) or in BTC: 13k36pym383rEmsBSLyWfT3TxCQMN2Lekd

## Copyright and License

Admin was written by Sleeping Owl for the Laravel framework and is released under the MIT License. See the LICENSE file for details.
