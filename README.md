![bg](https://image.ibb.co/m7Bx0F/12.png)

## Laravel Admin Panel

[![Build Status](https://travis-ci.org/LaravelRUS/SleepingOwlAdmin.svg?branch=master)](https://travis-ci.org/LaravelRUS/SleepingOwlAdmin)
[![StyleCI](https://styleci.io/repos/52141393/shield?branch=master)](https://styleci.io/repos/52141393)
[![Laravel Support](https://img.shields.io/badge/Laravel-5.5--5.8-brightgreen.svg)]()
[![PHP Support](https://img.shields.io/badge/PHP-7.x-brightgreen.svg)]()

[![Official Site](https://img.shields.io/badge/official-site-blue.svg)](https://sleepingowl.ru)
[![Demo Site](https://img.shields.io/badge/demo-site-blue.svg)](https://demo.sleepingowl.ru)
[![Telegram Chat](https://img.shields.io/badge/telegram-chat-blue.svg)](https://t.me/prtcls)
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

  	`composer require laravelrus/sleepingowl:5.6.*`
    

 2. Run this command in the terminal (if you want to know more about what exactly this command does, see [install command documentation](https://en.sleepingowladmin.ru/docs/installation)):

    ```
    $ php artisan sleepingowl:install
    ```
 3. After you have to update in `composer.json` post-update section:
    
    __Example__:
    ```
	"post-update-cmd": [
            "Illuminate\\Foundation\\ComposerScripts::postUpdate",
            "@php artisan sleepingowl:update",
    ]
    ```
    __NOTE__: So if you use a laravel-ide-helper package place `sleepingowl:update` after it commands:
    ```
	"post-update-cmd": [
            "Illuminate\\Foundation\\ComposerScripts::postUpdate",
            "@php artisan ide-helper:generate",
            "@php artisan ide-helper:meta",
            "@php artisan sleepingowl:update",
    ]
    ```
    

## Authentication
   
1. By default, admin module uses Laravel authentication.

   If you want to use auth, you can run artisan command `php artisan make:auth` (https://laravel.com/docs/authentication) 
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

## Copyright and License

Admin was written by Sleeping Owl for the Laravel framework and is released under the MIT License. 
See the LICENSE file for details.
