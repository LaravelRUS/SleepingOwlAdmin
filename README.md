![bg](https://image.ibb.co/m7Bx0F/12.png)

## Laravel Admin Panel

[![Build Status](https://travis-ci.org/LaravelRUS/SleepingOwlAdmin.svg?branch=master)](https://travis-ci.org/LaravelRUS/SleepingOwlAdmin)
[![StyleCI](https://styleci.io/repos/52141393/shield?branch=master)](https://styleci.io/repos/52141393)
[![Laravel Support](https://img.shields.io/badge/Laravel-5.5--6.3-brightgreen.svg)]()
[![PHP Support](https://img.shields.io/badge/PHP-7.1.3+-brightgreen.svg)]()

[![Official Site](https://img.shields.io/badge/official-site-blue.svg)](https://sleepingowladmin.ru)
[![Demo Site](https://img.shields.io/badge/demo-site-blue.svg)](https://demo.sleepingowladmin.ru/)
[![Telegram Chat](https://img.shields.io/badge/telegram-chat-blue.svg)](https://t.me/prtcls)
[![Latest Stable Version](https://poser.pugx.org/laravelrus/sleepingowl/v/stable)](https://packagist.org/packages/laravelrus/sleepingowl)
[![Total Downloads](https://poser.pugx.org/laravelrus/sleepingowl/downloads)](https://packagist.org/packages/laravelrus/sleepingowl)
[![License](https://poser.pugx.org/laravelrus/sleepingowl/license)](https://packagist.org/packages/laravelrus/sleepingowl)

SleepingOwl Admin is an administrative interface builder for Laravel.


## Documentation

* [Russian](http://sleepingowladmin.ru/#/ru/)
* [English](http://sleepingowladmin.ru/#/en/)

* [Docs Github](https://github.com/SleepingOwlAdmin/docs/tree/new)


## Installation

 1. Require this package in your composer.json and run composer update:

    - Bootstrap3 build

  	`composer require laravelrus/sleepingowl:5.8.*`

    - Bootstrap4 build (latest)

  	`composer require laravelrus/sleepingowl`


 2. Run this command in the terminal (if you want to know more about what exactly this command does, see [install command documentation](https://sleepingowladmin.ru/#/en/installation)):

    ```
    php artisan sleepingowl:install
    ```
 3. After you have to update in `composer.json` post-update section:

    __Example__:
    ```
	"post-update-cmd": [
            "Illuminate\\Foundation\\ComposerScripts::postUpdate",
            "@php artisan sleepingowl:update"
    ]
    ```
    __NOTE__: So if you use a laravel-ide-helper package place `sleepingowl:update` after it commands:
    ```
	"post-update-cmd": [
            "Illuminate\\Foundation\\ComposerScripts::postUpdate",
            "@php artisan ide-helper:generate",
            "@php artisan ide-helper:meta",
            "@php artisan sleepingowl:update"
    ]
    ```

## Update

  1. Change the version you need in `composer.json`

  __Example__:
  ```
  "laravelrus/sleepingowl": "dev-development-bs4"
  ```

  2. Run this command in the terminal:

  ```
  composer update laravelrus/sleepingowl
  ```

  3. Run command in the terminal for update assets:

  ```
  php artisan sleepingowl:update
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
