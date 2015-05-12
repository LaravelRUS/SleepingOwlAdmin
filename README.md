## Laravel 5 Admin Module

[![Latest Stable Version](https://poser.pugx.org/sleeping-owl/admin/v/stable.svg)](https://packagist.org/packages/sleeping-owl/admin)
[![License](https://poser.pugx.org/sleeping-owl/admin/license.svg)](https://packagist.org/packages/sleeping-owl/admin)

*Note: this is development version. If you are looking for stable version check out [master branch](https://github.com/sleeping-owl/admin).*

SleepingOwl Admin is administrative interface builder for Laravel.

It includes:

 - [sb-admin-2 template](http://startbootstrap.com/template-overviews/sb-admin-2/)
 - [jQuery 1.11.0](http://jquery.org)
 - [Bootstrap v3.2.0](http://getbootstrap.com)
 - [Chosen v1.4.2](http://harvesthq.github.io/chosen/)
 - [DataTables 1.10.0-dev](http://www.sprymedia.co.uk)
 - [Nestable jQuery Plugin](http://dbushell.github.io/Nestable/)
 - [Lightbox for Bootstrap 3](https://github.com/ashleydw/lightbox)
 - [Font Awesome 4.1.0](http://fontawesome.io)
 - [Metismenu 1.0.3](https://github.com/onokumus/metisMenu)
 - [morris.js v0.5.0]()
 - [bootbox.js v4.3.0](http://bootboxjs.com)
 - [Bootstrap datetimepicker](http://eonasdan.github.io/bootstrap-datetimepicker/)
 - [CKEditor](http://ckeditor.com)
 - [flow.js](https://github.com/flowjs/flow.js)

## Installation

 1. Require this package in your composer.json and run composer update:

		"sleeping-owl/admin": "dev-development"

 2. After composer update, add service providers to the `config/app.php`

	    'SleepingOwl\Admin\AdminServiceProvider',

 3. Add this to the facades in `config/app.php`:

		'Admin'         => 'SleepingOwl\Admin\Admin',
		'AdminAuth'     => 'SleepingOwl\AdminAuth\Facades\AdminAuth',
		'Column'        => 'SleepingOwl\Admin\Columns\Column',
		'ColumnFilter'  => 'SleepingOwl\Admin\ColumnFilters\ColumnFilter',
		'Filter'        => 'SleepingOwl\Admin\Filter\Filter',
		'AdminDisplay'  => 'SleepingOwl\Admin\Display\AdminDisplay',
		'AdminForm'     => 'SleepingOwl\Admin\Form\AdminForm',
		'AdminTemplate' => 'SleepingOwl\Admin\Templates\Facade\AdminTemplate',
		'FormItem'      => 'SleepingOwl\Admin\FormItems\FormItem',

 4. Run this command in terminal (if you want to know what exactly this command makes, see [install command documentation](http://sleeping-owl.github.io/en/Commands/Install.html)):

		$ php artisan admin:install

## Documentation

Documentation can be found at [sleeping owl documentation](http://sleeping-owl.github.io/v3).

## Demo Application

View [live demo](http://sleepingowladmindemo2.cloudcontrolled.com).

## Support Library

You can donate via [PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=AXJMWMRPCBGVA), Yandex money (410012943296949) or in BTC: 13k36pym383rEmsBSLyWfT3TxCQMN2Lekd

## Copyright and License

Admin was written by Sleeping Owl for the Laravel framework and is released under the MIT License. See the LICENSE file for details.