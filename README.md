![bg](https://image.ibb.co/m7Bx0F/12.png)

## Laravel Admin Panel

[![Build Status](https://travis-ci.org/LaravelRUS/SleepingOwlAdmin.svg?branch=development)](https://travis-ci.org/LaravelRUS/SleepingOwlAdmin)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/LaravelRUS/SleepingOwlAdmin/badges/quality-score.png?b=development)](https://scrutinizer-ci.com/g/LaravelRUS/SleepingOwlAdmin/?branch=development)
[![StyleCI](https://styleci.io/repos/52141393/shield?branch=development)](https://styleci.io/repos/52141393)
[![Laravel Support](https://img.shields.io/badge/Laravel-5.5--5.6-brightgreen.svg)]()
[![PHP Support](https://img.shields.io/badge/PHP-7.x-brightgreen.svg)]()
[![SensioLabsInsight](https://insight.sensiolabs.com/projects/5906214c-a896-432c-ac24-b28144d6af1b/mini.png)](https://insight.sensiolabs.com/projects/5906214c-a896-432c-ac24-b28144d6af1b)

[![Official Site](https://img.shields.io/badge/official-site-blue.svg)](https://sleepingowl.ru)
[![Demo Site](https://img.shields.io/badge/demo-site-blue.svg)](https://demo.sleepingowl.ru)
[![Join the chat at https://gitter.im/LaravelRUS/SleepingOwlAdmin](https://img.shields.io/badge/gitter-chat-yellowgreen.svg)](https://gitter.im/LaravelRUS/SleepingOwlAdmin)
[![Telegram Chat](https://img.shields.io/badge/telegram-chat-blue.svg)](https://t.me/sleeping_owl)
[![Latest Stable Version](https://poser.pugx.org/laravelrus/sleepingowl/v/stable)](https://packagist.org/packages/laravelrus/sleepingowl)
[![Total Downloads](https://poser.pugx.org/laravelrus/sleepingowl/downloads)](https://packagist.org/packages/laravelrus/sleepingowl)
[![License](https://poser.pugx.org/laravelrus/sleepingowl/license)](https://packagist.org/packages/laravelrus/sleepingowl)

*Note: This is the development version. If you are looking for the stable version check out [master branch](https://github.com/LaravelRUS/SleepingOwlAdmin).*

SleepingOwl Admin is an administrative interface builder for Laravel.


## Documentation

* [Russian](http://sleepingowladmin.ru/docs)
* [English](http://en.sleepingowladmin.ru/docs)


* [Docs Github](https://github.com/SleepingOwlAdmin/docs)


## Installation

 1. Require this package in your composer.json and run composer update:

  	`composer require laravelrus/sleepingowl:4.x-dev`
    

 2. After composer update, insert service provider in config/app.php
	```
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
  
   

 3. Run this command in the terminal (if you want to know more about what exactly this command does, see [install command documentation](https://en.sleepingowladmin.ru/docs/installation)):

    ```
    $ php artisan sleepingowl:install
    ```
 4. After you have to update in `composer.json` post-update section:
    
    __Example__:
    ```
	"post-update-cmd": [
            "Illuminate\\Foundation\\ComposerScripts::postUpdate",
            "php artisan sleepingowl:update",
            "php artisan optimize",
    ]
    ```
    __NOTE__: So if you use a laravel-ide-helper package place `sleepingowl:update` after it commands:
    ```
	"post-update-cmd": [
            "Illuminate\\Foundation\\ComposerScripts::postUpdate",
            "php artisan ide-helper:generate",
            "php artisan ide-helper:meta",
            "php artisan sleepingowl:update",
            "php artisan optimize",
    ]
    ```
    

## Authentication
   
1. By default, admin module uses Laravel authentication.

   If you want to use auth, you can run artisan command `php artisan make:auth` (https://laravel.com/docs/5.3/authentication) 
and append middleware `auth` to `config/sleeping_owl.php` 

   ```php
    ...
    'middleware' => ['web', 'auth']
    ...
    ```


2. Setting up middleware

   By default `auth` middleware use default guard, selected in `config/auth.php`
  
    ```php
    'defaults' => [
      'guard' => 'web', <- default
      ...
    ],
    ```
  
  3. If you are using some package for ACL like (Laratrust, Zizaco Entrust, etc...)
  
      ```php
      'middleware' => ['web', 'role:admin'],
      ```
      or
      ```php
      'middleware' => ['web', 'permission:admin'],
      ```


## Npm Packages
* ```js
  "devDependencies": {
    "admin-lte": "^2.3.5",
    "bootstrap": "^3.3.7",
    "bootstrap-daterangepicker": "^2.1.24",
    "datatables.net": "^1.10.12",
    "dropzone": "4.3.0",
    "eonasdan-bootstrap-datetimepicker": "^4.15.35",
    "font-awesome": "^4.6.3",
    "gulp": "^3.9.1",
    "i18next": "^3.4.1",
    "imports-loader": "^0.6.5",
    "jquery": "^2.1.1",
    "laravel-elixir": "^6.0.0-11",
    "laravel-elixir-vue-2": "^0.3.0",
    "laravel-elixir-webpack-official": "^1.0.2",
    "lodash": "^4.17.4",
    "magnific-popup": "^1.1.0",
    "metismenu": "^2.5.2",
    "moment": "^2.14.1",
    "nestable": "^0.2.0",
    "noty": "^2.3.8",
    "select2": "^4.0.3",
    "sortablejs": "1.4.2",
    "sweetalert2": "^4.1.0",
    "vue": "^2.3.3",
    "vue-multiselect": "^2.0.2",
    "vue-resource": "^1.3.3",
    "x-editable": "^1.5.1"
  }
  ```
## Copyright and License

Admin was written by Sleeping Owl for the Laravel framework and is released under the MIT License. 
See the LICENSE file for details.
