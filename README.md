![bg](https://image.ibb.co/m7Bx0F/12.png)

## Laravel Admin Panel SleepingOwl

[![Build Status](https://travis-ci.org/LaravelRUS/SleepingOwlAdmin.svg?branch=development)](https://travis-ci.org/LaravelRUS/SleepingOwlAdmin)
[![StyleCI](https://styleci.io/repos/52141393/shield?branch=development)](https://styleci.io/repos/52141393)
[![Laravel Support](https://img.shields.io/badge/Laravel-5.5--8.44-brightgreen.svg)]()
[![PHP Support](https://img.shields.io/badge/PHP-7.1.3+-brightgreen.svg)]()

[![Official Site](https://img.shields.io/badge/official-site-blue.svg)](https://sleepingowladmin.ru)
[![Demo Site](https://img.shields.io/badge/demo-site-blue.svg)](https://demo.sleepingowladmin.ru/)
[![Telegram Chat](https://img.shields.io/badge/telegram-chat-blue.svg)](https://t.me/prtcls)
[![Latest Stable Version](https://poser.pugx.org/laravelrus/sleepingowl/v/stable)](https://packagist.org/packages/laravelrus/sleepingowl)
[![Total Downloads](https://poser.pugx.org/laravelrus/sleepingowl/downloads)](https://packagist.org/packages/laravelrus/sleepingowl)
[![License](https://poser.pugx.org/laravelrus/sleepingowl/license)](https://packagist.org/packages/laravelrus/sleepingowl)

SleepingOwl Admin is an administrative interface builder for Laravel. __Completely free__

Support `Laravel > 5.5 - 5.8` (`PHP < 7.1.3`), `Laravel 6.*` (`PHP > 7.2`), `Laravel 7.*` (`PHP > 7.2.5`) and `Laravel 8.*` (`PHP > 7.3`)

__Lumen is NOT supported(((__


## Documentation new ver.8

Powered by Laravel 5.5 - 8+. (latest tested version 8.44.0)

* [Russian](http://sleepingowladmin.ru/#/ru/) (90% process)
* [English](http://sleepingowladmin.ru/#/en/) (30% process)

* [Docs Github](https://github.com/SleepingOwlAdmin/docs/tree/new)


## Install `ver 8.*` <small>(last Released)</small>

  Install SleepingOwl Admin

  `composer require laravelrus/sleepingowl:8.*`


## Install `ver 7.*`

  1. Install SleepingOwl Admin

  `composer require laravelrus/sleepingowl:7.*`

  __or__

  If you upgrade the old version change in `composer.json`

  ```
  "laravelrus/sleepingowl": "^7.*"
  ```

  after run `composer update laravelrus/sleepingowl`

  and run `php artisan sleepingowl:update` for update assets


2. Run this command in the terminal (if you want to know more about what exactly this command does, see [install command documentation](https://sleepingowladmin.ru/#/en/installation)):

  ```
  php artisan sleepingowl:install
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
